import io from 'socket.io-client'
const { VITE_LOCAL, DEV } = import.meta.env

export const SOCKET_EMIT_SET_TOPIC = 'set-topic'
export const SOCKET_EMIT_ORDER_GIG = 'gig-order'
export const SOCKET_EMIT_SEND_MSG = 'send-msg'
export const SOCKET_EMIT_UPDATE_REQUEST= 'update-request'
export const SOCKET_EMIT_OPEN_ORDER_CHAT = 'open-order-chat'
export const SOCKET_EMIT_ORDER_CHAT_MSG = 'send-order-chat-msg'

export const SOCKET_EVENT_ORDER_GIG = 'ordered-gig'
export const SOCKET_EVENT_MSG_SENT = 'msg-sent'
export const SOCKET_EVENT_REQUEST_UPDATED = 'request-updated'
export const SOCKET_EVENT_ORDER_CHAT_OPENED = 'order-chat-opened'
export const SOCKET_EVENT_ORDER_CHAT_MSG = 'order-chat-msg'

const baseUrl =
	import.meta.env.VITE_SOCKET_URL ||
	(import.meta.env.PROD ? '' : '//localhost:3030')

export const socketService = VITE_LOCAL === 'true' ? createDummySocketService() : createSocketService()

// for debugging from console
if (DEV) window.socketService = socketService

socketService.setup()

function createSocketService() {
	var socket = null
	const socketService = {
		setup() {
			socket = io(baseUrl)
		},
		on(eventName, cb) {
			socket.on(eventName, cb)
		},
		off(eventName, cb = null) {
			if (!socket) return
			if (!cb) socket.removeAllListeners(eventName)
			else socket.off(eventName, cb)
		},
		emit(eventName, data) {
			socket.emit(eventName, data)
		},
		terminate() {
			socket = null
		},
	}
	return socketService
}

function createDummySocketService() {
	var listenersMap = {}
	const socketService = {
		listenersMap,
		setup() {
			listenersMap = {}
		},
		terminate() {
			this.setup()
		},
		on(eventName, cb) {
			listenersMap[eventName] = [...(listenersMap[eventName] || []), cb]
		},
		off(eventName, cb) {
			if (!listenersMap[eventName]) return
			if (!cb) delete listenersMap[eventName]
			else listenersMap[eventName] = listenersMap[eventName].filter(l => l !== cb)
		},
		emit(eventName, data) {
			var listeners = listenersMap[eventName]
			if (eventName === SOCKET_EMIT_ORDER_GIG) {
				listeners = listenersMap[SOCKET_EVENT_ORDER_GIG]
			}
			if (eventName === SOCKET_EMIT_UPDATE_REQUEST) {
				listeners = listenersMap[SOCKET_EVENT_REQUEST_UPDATED]
			}
			if (eventName === SOCKET_EMIT_SEND_MSG) {
				listeners = listenersMap[SOCKET_EVENT_MSG_SENT]
			}
			if (eventName === SOCKET_EMIT_OPEN_ORDER_CHAT) {
				listeners = listenersMap[SOCKET_EVENT_ORDER_CHAT_OPENED]
			}
			if (eventName === SOCKET_EMIT_ORDER_CHAT_MSG) {
				listeners = listenersMap[SOCKET_EVENT_ORDER_CHAT_MSG]
			}
			if (!listeners) return

			listeners.forEach(listener => {
				listener(data)
			})
		},
	}
	window.listenersMap = listenersMap
	return socketService
}

// Basic Tests
// function cb(x) {console.log('Socket Test - Expected Puk, Actual:', x)}
// socketService.on('baba', cb)
// socketService.on('baba', cb)
// socketService.on('baba', cb)
// socketService.on('mama', cb)
// socketService.emit('baba', 'Puk')
// socketService.off('baba', cb)
