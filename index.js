var Player = require('player')
  , keypress = require('keypress')
  , Random = require('random-js')
  , random = Random()
  , config = require('./config')
  , patterns
  , lastPattern
  , startTime
  , timeout;

keypress(process.stdin);
process.stdin.on('keypress', function (ch, key) {
  var name = key ? key.name : null;
  if (name === 'space') {
    if (timeout) {
      console.log('stop juggling (' + (new Date() - startTime) / 1000 + 's total)');
      clearTimeout(timeout);
      timeout = null;
    } else {
      console.log('start juggling');
      setTimeout(function () {
        startTime = new Date();
        juggle();
      }, 3000);
    }
  } else if (name === 'q') {
    process.stdin.pause();
    process.exit(0);
  } else {
    showUsage();
  }
});
process.stdin.setRawMode(true);
process.stdin.resume();
showUsage();

function showUsage () {
  console.log('<space> to start/stop. \'q\' to quit.');
}

function juggle () {
  var pattern = getPattern()
    , length = random.integer(config.minPatternTime, config.maxPatternTime)
    , player = new Player('resources/' + pattern + '.mp3');
  console.log('- ' + pattern + ' (' + length + 's)');
  player.play(function (err) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
  });
  timeout = setTimeout(juggle, length * 1000);
}

function getPattern () {
  var pattern;
  if (config.completeBeforeRepeat) {
    if (!patterns || patterns.length === 0) {
      patterns = config.patterns.slice(0);
      random.shuffle(patterns);
    }
    pattern = patterns.pop();
  } else {
    pattern = random.pick(config.patterns);
    while (pattern === lastPattern) {
      pattern = random.pick(config.patterns);
    }
    lastPattern = pattern;
  }
  return pattern;
}
