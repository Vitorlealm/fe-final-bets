import { getJson, send, del } from './api'

const RES = '/events'

export function getEvents() {
  return getJson(RES)
}

export function getEventsByAdmin(adminId) {
  return getJson(`${RES}?adminId=${adminId}`)
}

export function createEvent(data) {
  return send(RES, 'POST', data)
}

export function updateEvent(id, patch) {
  return send(`${RES}/${id}`, 'PATCH', patch)
}

export function deleteEvent(id) {
  return del(`${RES}/${id}`)
}
