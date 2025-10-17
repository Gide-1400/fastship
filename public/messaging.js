// نظام الرسائل الفورية للمنصة
class MessagingManager {
    constructor() {
        this.messages = new Map();
        this.conversations = new Map();
        this.currentUser = null;
        this.init();
    }

    init() {
        this.loadMessages();
        this.loadConversations();
        this.setupRealTimeUpdates();
    }

    // بدء محادثة جديدة
    startConversation(shipmentId, participants) {
        const conversationId = 'CONV-' + Date.now();
        
        const conversation = {
            id: conversationId,
            shipmentId: shipmentId,
            participants: participants,
            lastMessage: null,
            lastMessageTime: null,
            unreadCount: 0,
            createdAt: new Date().toISOString(),
            status: 'active'
        };

        this.conversations.set(conversationId, conversation);
        this.saveConversations();
        
        return conversationId;
    }

    // إرسال رسالة
    sendMessage(conversationId, senderId, content, messageType = 'text') {
        const messageId = 'MSG-' + Date.now();
        
        const message = {
            id: messageId,
            conversationId: conversationId,
            senderId: senderId,
            content: content,
            type: messageType,
            timestamp: new Date().toISOString(),
            status: 'sent',
            readBy: [senderId]
        };

        // إضافة الرسالة للمحادثة
        if (!this.messages.has(conversationId)) {
            this.messages.set(conversationId, []);
        }
        
        this.messages.get(conversationId).push(message);
        
        // تحديث المحادثة
        const conversation = this.conversations.get(conversationId);
        if (conversation) {
            conversation.lastMessage = content;
            conversation.lastMessageTime = message.timestamp;
            conversation.unreadCount++;
        }

        this.saveMessages();
        this.saveConversations();
        
        // إشعار المشاركين
        this.notifyParticipants(conversationId, message);
        
        return messageId;
    }

    // إشعار المشاركين
    notifyParticipants(conversationId, message) {
        const conversation = this.conversations.get(conversationId);
        if (!conversation) return;

        // إضافة إشعار للمشاركين
        conversation.participants.forEach(participantId => {
            if (participantId !== message.senderId) {
                this.addNotification({
                    type: 'new_message',
                    title: 'رسالة جديدة',
                    message: message.content,
                    conversationId: conversationId,
                    senderId: message.senderId,
                    timestamp: new Date().toISOString()
                });
            }
        });

        // في التطبيق الحقيقي، هنا سنرسل إشعارات push
        console.log(`رسالة جديدة في المحادثة ${conversationId}: ${message.content}`);
    }

    // إضافة إشعار
    addNotification(notification) {
        const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        notifications.unshift(notification);
        localStorage.setItem('notifications', JSON.stringify(notifications));
    }

    // جلب رسائل المحادثة
    getConversationMessages(conversationId) {
        return this.messages.get(conversationId) || [];
    }

    // جلب جميع المحادثات
    getAllConversations() {
        return Array.from(this.conversations.values());
    }

    // جلب محادثات المستخدم
    getUserConversations(userId) {
        return Array.from(this.conversations.values()).filter(conv => 
            conv.participants.includes(userId)
        );
    }

    // تحديث حالة القراءة
    markAsRead(conversationId, userId) {
        const conversation = this.conversations.get(conversationId);
        if (!conversation) return;

        // إضافة المستخدم لقائمة القراءة للرسائل غير المقروءة
        const messages = this.messages.get(conversationId) || [];
        messages.forEach(message => {
            if (!message.readBy.includes(userId)) {
                message.readBy.push(userId);
            }
        });

        // إعادة تعيين عداد الرسائل غير المقروءة
        conversation.unreadCount = 0;
        
        this.saveMessages();
        this.saveConversations();
    }

    // إرسال رسالة نصية
    sendTextMessage(conversationId, senderId, text) {
        return this.sendMessage(conversationId, senderId, text, 'text');
    }

    // إرسال رسالة مع صورة
    sendImageMessage(conversationId, senderId, imageUrl, caption = '') {
        const content = {
            type: 'image',
            url: imageUrl,
            caption: caption
        };
        return this.sendMessage(conversationId, senderId, JSON.stringify(content), 'image');
    }

    // إرسال رسالة مع موقع
    sendLocationMessage(conversationId, senderId, latitude, longitude, address = '') {
        const content = {
            type: 'location',
            latitude: latitude,
            longitude: longitude,
            address: address
        };
        return this.sendMessage(conversationId, senderId, JSON.stringify(content), 'location');
    }

    // إرسال رسالة مع ملف
    sendFileMessage(conversationId, senderId, fileUrl, fileName, fileSize) {
        const content = {
            type: 'file',
            url: fileUrl,
            name: fileName,
            size: fileSize
        };
        return this.sendMessage(conversationId, senderId, JSON.stringify(content), 'file');
    }

    // حذف رسالة
    deleteMessage(messageId) {
        let deleted = false;
        
        this.messages.forEach((messages, conversationId) => {
            const messageIndex = messages.findIndex(msg => msg.id === messageId);
            if (messageIndex !== -1) {
                messages.splice(messageIndex, 1);
                deleted = true;
            }
        });

        if (deleted) {
            this.saveMessages();
        }
        
        return deleted;
    }

    // حذف محادثة
    deleteConversation(conversationId) {
        const deleted = this.conversations.delete(conversationId);
        if (deleted) {
            this.messages.delete(conversationId);
            this.saveConversations();
            this.saveMessages();
        }
        return deleted;
    }

    // البحث في الرسائل
    searchMessages(query, conversationId = null) {
        const results = [];
        const searchQuery = query.toLowerCase();
        
        const conversationsToSearch = conversationId ? 
            [conversationId] : 
            Array.from(this.messages.keys());

        conversationsToSearch.forEach(convId => {
            const messages = this.messages.get(convId) || [];
            messages.forEach(message => {
                if (message.content.toLowerCase().includes(searchQuery)) {
                    results.push({
                        ...message,
                        conversationId: convId
                    });
                }
            });
        });

        return results.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }

    // إعداد التحديثات الفورية
    setupRealTimeUpdates() {
        // في التطبيق الحقيقي، هنا سنستخدم WebSocket أو Firebase Realtime Database
        setInterval(() => {
            this.checkForNewMessages();
        }, 5000); // كل 5 ثوانٍ
    }

    // فحص الرسائل الجديدة
    checkForNewMessages() {
        // في التطبيق الحقيقي، هنا سنتحقق من الخادم
        console.log('فحص الرسائل الجديدة...');
    }

    // حفظ الرسائل
    saveMessages() {
        const data = Array.from(this.messages.entries());
        localStorage.setItem('messages', JSON.stringify(data));
    }

    // تحميل الرسائل
    loadMessages() {
        const data = localStorage.getItem('messages');
        if (data) {
            const entries = JSON.parse(data);
            this.messages = new Map(entries);
        }
    }

    // حفظ المحادثات
    saveConversations() {
        const data = Array.from(this.conversations.entries());
        localStorage.setItem('conversations', JSON.stringify(data));
    }

    // تحميل المحادثات
    loadConversations() {
        const data = localStorage.getItem('conversations');
        if (data) {
            const entries = JSON.parse(data);
            this.conversations = new Map(entries);
        }
    }

    // إحصائيات الرسائل
    getMessagingStats() {
        const allMessages = Array.from(this.messages.values()).flat();
        const allConversations = Array.from(this.conversations.values());
        
        return {
            totalMessages: allMessages.length,
            totalConversations: allConversations.length,
            unreadMessages: allConversations.reduce((sum, conv) => sum + conv.unreadCount, 0),
            activeConversations: allConversations.filter(conv => conv.status === 'active').length
        };
    }
}

// تهيئة نظام الرسائل
window.messagingManager = new MessagingManager();

// دوال مساعدة للواجهة
function showChatModal(conversationId) {
    const conversation = window.messagingManager.conversations.get(conversationId);
    if (!conversation) return;

    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] flex flex-col">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-xl font-bold text-gray-800">محادثة الشحنة</h3>
                <button onclick="closeChatModal()" class="text-gray-500 hover:text-gray-700 text-2xl">×</button>
            </div>
            
            <div id="chatMessages" class="flex-1 overflow-y-auto mb-4 space-y-4 max-h-96">
                ${renderMessages(conversationId)}
            </div>
            
            <div class="flex gap-2">
                <input type="text" id="messageInput" placeholder="اكتب رسالتك..." 
                       class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <button onclick="sendChatMessage('${conversationId}')" 
                        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold">
                    إرسال
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // إضافة مستمع لإرسال الرسالة عند الضغط على Enter
    document.getElementById('messageInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendChatMessage(conversationId);
        }
    });

    // تمرير للأسفل
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function closeChatModal() {
    const modal = document.querySelector('.fixed.inset-0.bg-black.bg-opacity-50');
    if (modal) {
        modal.remove();
    }
}

function renderMessages(conversationId) {
    const messages = window.messagingManager.getConversationMessages(conversationId);
    const currentUser = window.authManager?.getCurrentUser();
    
    return messages.map(message => {
        const isOwn = message.senderId === currentUser?.uid;
        const messageContent = parseMessageContent(message);
        
        return `
            <div class="flex ${isOwn ? 'justify-end' : 'justify-start'}">
                <div class="max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    isOwn ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
                }">
                    <div class="text-sm">${messageContent}</div>
                    <div class="text-xs mt-1 opacity-75">${formatTime(message.timestamp)}</div>
                </div>
            </div>
        `;
    }).join('');
}

function parseMessageContent(message) {
    if (message.type === 'text') {
        return message.content;
    } else if (message.type === 'image') {
        const content = JSON.parse(message.content);
        return `<img src="${content.url}" alt="صورة" class="max-w-full h-auto rounded">`;
    } else if (message.type === 'location') {
        const content = JSON.parse(message.content);
        return `📍 ${content.address || 'موقع'}`;
    } else if (message.type === 'file') {
        const content = JSON.parse(message.content);
        return `📎 ${content.name}`;
    }
    return message.content;
}

function sendChatMessage(conversationId) {
    const input = document.getElementById('messageInput');
    const content = input.value.trim();
    
    if (!content) return;
    
    const currentUser = window.authManager?.getCurrentUser();
    if (!currentUser) {
        showNotification('يجب تسجيل الدخول أولاً', 'error');
        return;
    }
    
    // إرسال الرسالة
    window.messagingManager.sendTextMessage(conversationId, currentUser.uid, content);
    
    // مسح حقل الإدخال
    input.value = '';
    
    // تحديث عرض الرسائل
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.innerHTML = renderMessages(conversationId);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    showNotification('تم إرسال الرسالة', 'success');
}

function formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString('ar-SA', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

// دالة عرض الإشعارات
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg text-white ${
        type === 'success' ? 'bg-green-500' : 
        type === 'error' ? 'bg-red-500' : 
        'bg-blue-500'
    }`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}