const { Wechaty, Room } = require('wechaty')

Wechaty.instance()
    .on('scan', (url, code) => {
        let loginUrl = url.replace('qrcode', 'l')
        require('qrcode-terminal').generate(loginUrl)
        console.log(url)
    })

.on('login', user => {
    console.log(`${user} login`)
})

.on('friend', async function (contact, request) {
                if (request) {
                        await request.accept()
                        let keyroom = await Room.find({ topic:"菀草壹服务区" })
                        if (keyroom) {
                                await keyroom.add(contact)
                                await keyroom.say("欢迎来到菀草易购", contact)
                        }
                        console.log(`Contact: ${contact.name()} send request ${request.hello}`)
                }
  })

.on('message', function(m) {
    const contact = m.from()
    const content = m.content()
    const room = m.room()

    if (room) {
        console.log(`Room: ${room.topic()} Contact: ${contact.name()} Content: ${content}`)
    } else {
        console.log(`Contact: ${contact.name()} Content: ${content}`)
    }

    if (m.self()) {
        return
    }

    if (/hello/.test(content)) {
        m.say("hello how are you")
    }

    if (/out/.test(content)) {
        Room.find({ topic: "test" }).then(function(keyroom) {
            if (keyroom) {
                keyroom.del(contact).then(function() {
                    keyroom.say("Remove from the room", contact)
                })
            }
        })
    }
})

.init()
