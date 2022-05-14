const {shuffleArray} = require('./utils')

let testData = ['The Hammer', 'Crowbar', 'Rusty', 'Beta', 'Prime Information Drone', 'Brobot', 'Nozzle', 'Globotron', 'Self-Aware Garbage Android', 'Mechi']

describe('shuffleArray functions', () => {
    
    test('shuffleArray should return same length array', () => {
        const newArr = shuffleArray(testData)

        expect(newArr).toHaveLength(10);
    });

    test('shuffleArray still contains same strings', () => {
        const newArr = shuffleArray(testData);

        expect(newArr).toEqual(expect.arrayContaining(testData));
    });
});