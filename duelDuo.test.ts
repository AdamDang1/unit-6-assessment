
import { Builder, Capabilities, By } from "selenium-webdriver"

require('chromedriver')

const driver = new Builder().withCapabilities(Capabilities.chrome()).build()

const {makeRobotChoiceCard, makeRobotPlayerCard, makeRobotDisplayCard, renderChoices, renderCompDuo, renderPlayerDuo, chooseBot, putBotBack, drawFive, duel, getAllBots} = require('/public/index.js');

beforeEach(async () => {
    driver.get('http://localhost:3000/')
})

afterAll(async () => {
    await driver.sleep(1000);
    driver.quit();
})

test('Title shows up when page loads', async () => {
    const title = await driver.findElement(By.id('title'))
    const displayed = await title.isDisplayed()
    expect(displayed).toBe(true)
})

test('Draw button displays choices for bots', async () => {
    await drawFive(driver);
});

test('Get all bots button displays all bots', async () => {
    await getAllBots(driver);
});