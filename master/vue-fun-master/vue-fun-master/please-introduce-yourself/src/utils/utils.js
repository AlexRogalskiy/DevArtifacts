import moment from 'moment'

function dateToString (date) {
  if (date) {
    return moment(date).format('MMMM Do YYYY, h:mm:ss a')
  }
  return ''
}

export { dateToString }
