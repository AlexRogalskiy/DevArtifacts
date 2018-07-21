const $items = getItems()
const permItems = ['its']

/**
 * @returns {object}
 */
function getItems () {
  const result = {}
  const dots = '.clock .content .dots .dot'
  const words = '.clock .content .line .word'

  $(words).each(function () {
    const $word = $(this)
    let label = $word.text().replace('\'', '')

    if (result[label]) {
      label += '2'
    }

    result[label] = $word
  })

  $(dots).each(function () {
    const $dot = $(this)
    const label = $dot.text()

    result['dot' + label] = $dot
  })

  result.all = $(`${dots}, ${words}`)
  return result
}

/**
 * Updates time ticker
 */
function updateTicker () {
  const time = moment().format('hh:mm:ss')

  $('#ticker').text(time)
}

/**
 * Resets and activates new items
 */
function updateClock (items) {
  $items.all.removeClass('active')

  items.forEach(item => {
    $items[item].addClass('active')
  })
}

/**
 * Determines the proper hour item(s) to use
 *
 * @returns {array}
 */
function getHourItems (hour, minutes) {
  const result = []
  const map = { 1: 'one', 2: 'two', 3: 'three', 4: 'four',
    5: 'five2', 6: 'six', 7: 'seven', 8: 'eight', 9: 'nine',
    10: 'ten2', 11: 'eleven', 12: 'twelve' }

  // direction only applies to minutes > 4
  if (minutes > 4) {
    let direction

    if (minutes > 34) {
      direction = 'to'

      // use next hour
      if (hour === 12) {
        hour = 1
      } else {
        hour++
      }
    } else {
      direction = 'past'
    }

    result.push(direction)
  }

  result.push(map[hour])
  return result
}

/**
 * Determines the proper minute item(s) to use
 *
 * @returns {array}
 */
function getMinuteItems (minutes) {
  const map = {
    '0-4': ['oclock'],
    '5-9,55-59': ['five'],
    '10-14,50-54': ['ten'],
    '15-19,45-49': ['quarter'],
    '20-24,40-44': ['twenty'],
    '25-29,35-39': ['twenty', 'five'],
    '30-34': ['half']
  }
  let result = []

  // each map range
  mapLoop:
  for (let ranges in map) {
    let items = map[ranges]
    let rangesArr = ranges.split(',')

    // each 'n-n' segment
    for (let i = 0; i < rangesArr.length; i++) {
      let range = rangesArr[i].split('-')
      let floor = range[0]
      let ceil = range[1]

      // minutes match map range
      if (minutes >= floor && minutes <= ceil) {
        result = result.concat(items)

        // dots for overflow minutes
        if (minutes > floor) {
          let remainder = minutes - floor

          for (let i = 1; i <= remainder; i++) {
            result.push('dot' + i)
          }
        }

        break mapLoop
      }
    }
  }

  return result
}

/**
 * Determines what items need to be activated for the
 * current time
 *
 * @returns {array}
 */
function getTimeItems () {
  const time = moment()
  const hour = Number(time.format('h'))
  const minutes = time.minutes()

  return []
    .concat(getHourItems(hour, minutes))
    .concat(getMinuteItems(minutes))
    .concat(permItems)
}

/**
 * Updates clock with current time
 */
function update () {
  const newItems = getTimeItems()

  updateClock(newItems)
  updateTicker()
}

// start ticking
new Tock({
  interval: 1000,
  callback: update
}).start()
