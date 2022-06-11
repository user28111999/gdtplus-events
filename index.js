let Core = {}

/**
 * Events ideas:
 * - The office got robbed 
 * - The office got robbed (lvl 3)
 * - The office got robbed (lvl 4)
 */

(() => {
    // The office got robbed
    Core.addEvent = () => {
        const eventId = "lol123"

        const firstEventTest = {
            id: eventId,
            isRandom: true,
            maxTriggers: 4,
            trigger: (company) => company.currentLevel == 2 && company.isGameProgressBetween(1.2, 1.9),
            getNotification: (company) => {
                const game = company.currentGame
                
                const message = "The office got robbed! It seems that the perpretuator(s) have stolen some computers and office supplies, you can ignore it, replace them or you can try to find the perpretuator(s) by hiring a private detective."
                message.localize().format(game.title)

                return new Notification({
                    sourceId, eventId,
                    header: "Office robbery".localize(),
                    text: message,
                    options: [
                        "Hire 'Mr. Dick Tektiv'".localize(),
                        "Replace".localize(), // Replace the office supplies (company.currentMoney += company.currentMoney * 0.25) (Gain [currentPoints] + 10% of technology, research and speed points)
                        "Ignore".localize() // Money is lost, you lose 25% of your money
                    ]
                })
            },
            complete: (decision) => {
                const company = GameManager.company

                if (decision === 0) {
                    let randomDecision = ""

                    const outcomes = {
                        0: "You have hired 'Mr. Dick Tektiv' to find the perpretuators but it seems that they have already sold the computers and office supplies, you can't replace them. However, your insurance gave you 10% of the money back to replace your supplies.",
                        1: "You have hired 'Mr. Dick Tektiv' to find the perpretuators and he found the computers and office supplies. However, the perpretuators has escaped.",
                        2: "'Mr. Dick Tektiv' has been hired to investigate, but he seems to be a bit too busy to be of any use."
                    }

                    if (Math.random() < 0.5) randomDecision = outcomes["0"]
                    else if (Math.random() < 0.25) randomDecision = outcomes["1"]
                    else randomDecision = outcomes["2"]

                    let notification = new Notification({
                        header: "Hired 'Mr. Dick Tektiv'".localize(),
                        text: randomDecision,
                    })

                    if (randomDecision === outcomes["0"]) {
                        notification.adjustCash(company.currentMoney -= company.currentMoney * 0.25, "Equipment stolen")
                        notification.adjustCash(company.currentMoney * 0.1, "Insurance")
                        
                        company.activeNotifications.addRange(notification.split())
                        return
                    }

                    if (randomDecision === outcomes["1"]) {
                        notification.adjustCash(company.currentMoney -= company.currentMoney * 0.25, "Equipment retrieved")
                        company.activeNotifications.addRange(notification.split())
                        return
                    }

                    if (randomDecision === outcomes["2"]) {
                        company.activeNotifications.addRange(notification.split())
                        return
                    }
                } 
                
                if (decision === 1) {
                    let notification = new Notification({
                        header: "Office robbery".localize(),
                        text: "You have replaced the office supplies, you lost some money but your technology points increased."
                    })

                    notification.adjustCash(company.currentMoney -= company.currentMoney * 0.25, "Equipment stolen")
                    notification.adjustCash(company.currentMoney -= company.currentMoney * 0.25, "Equipment replaced")
                    // notification.adjustTech(company.currentTechPoints += company.currentTechPoints * 0.1, "tech pointslol")

                    company.activeNotifications.addRange(notification.split())
                    return
                }
                
                if (decision === 2) {
                    let notification = new Notification({
                        header: "Office robbery".localize(),
                        text: "You have ignored the office robbery and lost some money.".localize(),
                    })

                    notification.adjustCash(company.currentMoney -= company.currentMoney * 0.25, "Equipment stolen")
                    company.activeNotifications.addRange(notification.split())
                    return
                }
            }
        }

        GDT.addEvent(firstEventTest)
    }
})()