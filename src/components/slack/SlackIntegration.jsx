"use client"

import { useState, useEffect } from "react"
import { Send, MessageCircle, Hash } from "lucide-react"
import { projectApi } from "../../services/projectApi"

const SlackIntegration = ({ onClose }) => {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState("")
  const [newMessage, setNewMessage] = useState("")
  const [selectedChannel, setSelectedChannel] = useState("slack-bot-channel")

  const channels = [
    { id: "slack-bot-channel", name: "#slack-bot-channel" },
    { id: "C09DRNSNYDV", name: "#general" },
    { id: "random", name: "#random" },
    { id: "development", name: "#development" },
  ]

  useEffect(() => {
    fetchMessages()
  }, [selectedChannel])

  const fetchMessages = async () => {
    try {
      setLoading(true)
      const response = await projectApi.getSlackHistory(selectedChannel, 20)
      setMessages(response.data || [])
    } catch (err) {
      setError("Failed to load messages")
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    setSending(true)
    setError("")

    try {
      await projectApi.sendSlackMessage(selectedChannel, newMessage)
      setNewMessage("")
      // Add the message to local state for immediate feedback
      const newMsg = {
        id: Date.now(),
        text: newMessage,
        user: "You",
        timestamp: new Date().toISOString(),
        channel: selectedChannel,
      }
      setMessages((prev) => [newMsg, ...prev])
    } catch (err) {
      setError("Failed to send message")
    } finally {
      setSending(false)
    }
  }

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <MessageCircle className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-900">Slack Integration</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>

        {error && <div className="mx-6 mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}

        <div className="flex flex-1 overflow-hidden">
          {/* Channel Selector */}
          <div className="w-64 border-r bg-gray-50 p-4">
            <h3 className="font-medium text-gray-900 mb-3">Channels</h3>
            <div className="space-y-1">
              {channels.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => setSelectedChannel(channel.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 ${
                    selectedChannel === channel.id ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Hash className="w-4 h-4" />
                  {channel.name}
                </button>
              ))}
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 flex flex-col">
            {/* Messages List */}
            <div className="flex-1 overflow-y-auto p-4">
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-12">
                  <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <div className="text-gray-400 text-lg mb-2">No messages yet</div>
                  <p className="text-gray-500">Send your first message to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className="flex gap-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {message.user?.charAt(0) || "U"}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900">{message.user || "Unknown User"}</span>
                          <span className="text-xs text-gray-500">{formatTimestamp(message.timestamp)}</span>
                        </div>
                        <p className="text-gray-700">{message.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="border-t p-4">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={`Message ${channels.find((c) => c.id === selectedChannel)?.name || selectedChannel}`}
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={sending}
                />
                <button
                  type="submit"
                  disabled={sending || !newMessage.trim()}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {sending ? "Sending..." : "Send"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SlackIntegration
