
const gemPuzzle = {

    elements: {
        main: null,
        info: null,
        field: null,
        puzzlesContainer: null,
        puzzles: null,
        time: null,
        moves: 0,
        congratulations: null,
        menu: null,
        menuButtons: ['Scores', 'New game', `Field type`, 'Sound', 'Pause', 'Change Image'],
        scoresInfo: null,
        empty: null,
        cells: [],
    },

    properties: {
        layout: "4*4",
        puzzlesNumber: 0,
        rowLength: null,
        cellSize: null,
        currentField: null,
        gridTemplateArea: null,

        paused: false,
        soundOn: true,
        completed: false,
        scoreShown: false,
        scores: [],
    },

    layoutTypes: [
        "3*3",
        "4*4",
        "5*5",
        "6*6",
        "7*7",
        "8*8"
    ],

    imagesPath: "src/images",

    init() {

        // Create main elements, classes and DOM structure
        this.elements.main = document.createElement('main')
        this.elements.main.classList.add('puzzle-game')

        // Create block Info
        this.elements.info = document.createElement('section')
        this.elements.info.classList.add('info')

        const infoWrapper = document.createElement('div')
        infoWrapper.classList.add('wrapper')

        const infoContent = document.createElement('div')
        infoContent.classList.add('info-content')

        this.elements.time = document.createElement('time')
        this.elements.time.classList.add('info-content__time')
        this.elements.time.innerText = 'Time 00:02'

        this.elements.moves = document.createElement('div')
        this.elements.moves.classList.add('info-content__moves')
        this.elements.moves.innerText = 'Moves 0'

        document.body.appendChild(this.elements.main)
        this.elements.main.appendChild(this.elements.info)
        this.elements.info.appendChild(infoWrapper)
        infoWrapper.appendChild(infoContent)
        infoContent.appendChild(this.elements.time)
        infoContent.appendChild(this.elements.moves)


        // Create block Game
        const game = document.createElement('section')
        game.classList.add('game')

        const gameWrapper = document.createElement('div')
        gameWrapper.classList.add('wrapper')

        this.elements.field = document.createElement('section')
        this.elements.field.classList.add('play-field')

        this.elements.puzzlesContainer = document.createElement('div')
        this.elements.puzzlesContainer.classList.add('puzzles')

        this.elements.main.appendChild(game)
        game.appendChild(gameWrapper)
        gameWrapper.appendChild(this.elements.field)
        this.elements.field.appendChild(this.elements.puzzlesContainer)
        this.elements.puzzlesContainer.appendChild(this._createPuzzles())  // ФУНКЦИЯ ПО ДОБАВЛЕНИЮ ПАЗЛОВ
        this.elements.puzzlesContainer.addEventListener('dragover', this._dragOver)
        this.elements.puzzlesContainer.addEventListener('dragenter', this._dragEnter)
        this.elements.puzzlesContainer.addEventListener('dragleave', this._dragLeave)
        this.elements.puzzlesContainer.addEventListener('drop', this._dragDrop)

        this.elements.puzzles = this.elements.puzzlesContainer.querySelectorAll('.puzzles__item')

        // Create block Show-scores
        this.elements.scoresInfo = document.createElement('section')
        this.elements.scoresInfo.classList.add('scores-info')

        const scoresWrapper = document.createElement('div')
        scoresWrapper.classList.add('wrapper')

        const scoresInfoContent = document.createElement('div')
        scoresInfoContent.classList.add('scores-info__content')
        scoresInfoContent.innerHTML = '<p>Best games</p>'

        gameWrapper.appendChild(this.elements.scoresInfo)
        this.elements.scoresInfo.appendChild(scoresWrapper)
        scoresWrapper.appendChild(scoresInfoContent)

        // Create block Menu
        this.elements.menu = document.createElement('section')
        this.elements.menu.classList.add('menu')

        const menuWrapper = document.createElement('div')
        menuWrapper.classList.add('wrapper')

        const navigation = document.createElement('nav')
        navigation.classList.add('navigation')

        this.elements.main.appendChild(this.elements.menu)
        this.elements.menu.appendChild(menuWrapper)
        menuWrapper.appendChild(navigation)
        navigation.appendChild(this._createButtons())  // ФУНКЦИЯ ПО ДОБАВЛЕНИЮ КНОПОК

        // Create block Message
        const message = document.createElement('section')
        message.classList.add('message', 'message--active')

        const messageWrapper = document.createElement('div')
        messageWrapper.classList.add('wrapper')

        const messageContent = document.createElement('div')
        messageContent.classList.add('message__content')
        messageContent.innerText = 'Congratulations! You solved it for 01:01 and 10 moves'

        this.elements.main.appendChild(message)
        message.appendChild(messageWrapper)
        messageWrapper.appendChild(messageContent)
    },

    _createPuzzles() {
        const fragment = document.createDocumentFragment();

        switch (this.properties.layout) {
            case "4*4":
                this.properties.puzzlesNumber = 4 * 4
                break;
            case "5*5":
                this.properties.puzzlesNumber = 5 * 5
                break;
            case "6*6":
                this.properties.puzzlesNumber = 6 * 6
                break;
            case "7*7":
                this.properties.puzzlesNumber = 7 * 7
                break;
            case "8*8":
                this.properties.puzzlesNumber = 8 * 8
                break;
            default: //case 3*3
                this.properties.puzzlesNumber = 3 * 3
                break;
        }

        // ВОТ ТУТ МЕНЯЕМ ВСЕ С ГРИДА НА ПОЗИШН АБСОЛЮТ                      МЕНЯЕМ

        this.properties.rowLength = Math.sqrt(this.properties.puzzlesNumber)

        const numbers = [...Array(this.properties.puzzlesNumber).keys()]
            .sort(() => Math.random() - 0.5)

        this.elements.cells = []

        for (let i = 0; i < this.properties.puzzlesNumber; i += 1) {
            const puzzleElement = document.createElement('div')
            this.properties.cellSize = 100 / this.properties.rowLength

            if (numbers[i] === 0) {
                const left = i % (this.properties.rowLength)
                const top = (i - left) / this.properties.rowLength

                this.elements.empty = {
                    value: numbers[i],
                    left: left,
                    top: top,
                }

                this.elements.cells.push(this.elements.empty)

            } else {
                puzzleElement.classList.add('puzzles__item', 'puzzles__item--filled')
                puzzleElement.setAttribute('draggable', 'true')
                const value = numbers[i]
                puzzleElement.innerText = value

                const left = i % (this.properties.rowLength)
                const top = (i - left) / this.properties.rowLength

                puzzleElement.style = `top: ${top * this.properties.cellSize}%;
                                      left: ${left * this.properties.cellSize}%;
                                      width: ${this.properties.cellSize}%;
                                      height: ${this.properties.cellSize}%;`

                this.elements.cells.push({
                    value: value,
                    left: left,
                    top: top,
                    element: puzzleElement,
                })

                puzzleElement.addEventListener('dragstart', (e) => {
                    this._dragStart(e)
                })
                puzzleElement.addEventListener('dragend', (e) => {
                    this._dragEnd(e, left, top, i)
                })
                puzzleElement.addEventListener('click', (e) => {
                    this._shiftPuzzle(e, left, top, i)
                    this._playSound()
                })
            }
            fragment.appendChild(puzzleElement)
        }

        return fragment
    },

    _createButtons() {
        const fragment = document.createDocumentFragment()

        const createIconHtml = (icon_name) => {
            return `<i class="material-icons">${icon_name}</i>`
        }

        this.elements.menuButtons.forEach(button => {

            const buttonElement = document.createElement('button')
            buttonElement.classList.add('navigation__button')

            switch (button) {
                case 'Scores':
                    buttonElement.setAttribute('id', 'scores')
                    buttonElement.innerText = 'Scores'
                    buttonElement.addEventListener('click', (e) => {
                        this._toggleScore()
                        this._playSound()
                    })
                    break;
                case 'New game':
                    buttonElement.setAttribute('id', 'new-game')
                    buttonElement.innerText = 'New game'
                    buttonElement.addEventListener('click', (e) => {
                        this._pressNewGame()
                        this._playSound()
                    })
                    break;
                case 'Field type':
                    buttonElement.setAttribute('id', 'layout')
                    buttonElement.innerText = this.properties.layout
                    buttonElement.addEventListener('click', (e) => {
                        this._changeLayOut(e)
                        this._pressNewGame()
                        this._playSound()
                    })
                    break;
                case 'Sound':
                    buttonElement.setAttribute('id', 'sound')
                    buttonElement.innerHTML = createIconHtml('volume_off')
                    buttonElement.addEventListener('click', (e) => {
                        this._toggleSound()
                        this._playSound()
                    })
                    break;
                case 'Pause':
                    buttonElement.setAttribute('id', 'pause')
                    buttonElement.innerHTML = createIconHtml('pause')
                    buttonElement.addEventListener('click', (e) => {
                        this._togglePause()
                        this._playSound()
                    })
                    break;
                case 'Change Image':
                    buttonElement.setAttribute('id', 'change-image')
                    buttonElement.innerHTML = createIconHtml('loop')
                    buttonElement.addEventListener('click', (e) => {
                        this._changeImage()
                        this._pressNewGame()
                        this._playSound()
                    })
                    break;
            }

            fragment.appendChild(buttonElement)

        })

        return fragment

    },

    _startNewGame() {

    },

    _startSavedGame() {

    },

    _shiftPuzzle(e, left, top, index) {
        const cell = this.elements.cells[index]


        const leftDiff = Math.abs(this.elements.empty.left - cell.left)
        const topDiff = Math.abs(this.elements.empty.top - cell.top)

        if (leftDiff + topDiff > 1) {
            return
        }

        cell.element.style = `top: ${this.elements.empty.top * this.properties.cellSize}%;
                          left: ${this.elements.empty.left * this.properties.cellSize}%;
                          width: ${this.properties.cellSize}%;
                          height: ${this.properties.cellSize}%`

        const emptyLeft = this.elements.empty.left
        const emptyTop = this.elements.empty.top
        this.elements.empty.left = cell.left
        this.elements.empty.top = cell.top
        cell.left = emptyLeft
        cell.top = emptyTop

        const isFinished = this.elements.cells.every(cell => {
            return cell.value === cell.top * 4 + cell.left
        })

        function greetWinner() {
            alert('Congratulations! You won!')
        }

        if (isFinished) {
            setTimeout(greetWinner, 600)
        }

    },

    _endGame() {

    },

    _showTime() {

    },

    _showMoves() {

    },

    _toggleScore() {

    },

    _pressNewGame() {
        this.elements.puzzlesContainer.innerHTML = ''
        this.elements.puzzlesContainer.appendChild(this._createPuzzles())
    },

    _changeLayOut(e) {
        //Change the button
        let layoutIndex = this.layoutTypes.indexOf(this.properties.layout)
        if (layoutIndex === this.layoutTypes.length - 1) {
            layoutIndex = 0
        } else {
            layoutIndex += 1
        }
        this.properties.layout = this.layoutTypes[layoutIndex]
        e.target.innerText = this.properties.layout

        //Change the layout
        this.elements.puzzlesContainer.innerHTML = ''
        this.elements.puzzlesContainer.appendChild(this._createPuzzles())


        // СОХРАНЯТЬ В ЛОКАЛ СТОР ТЕКУЩИЙ ЛЭЙАУТ
    },

    _changeImage() {

    },

    _toggleSound() {

    },

    _playSound() {

    },

    _togglePause() {

    },

    _showCongrats() {

    },

    _dragStart(e) {
        console.log(e.target);
        setTimeout(() => {
            e.target.classList.add('puzzles__item--hide')
        }, 0)
    },

    _dragEnd(e, left, top, index){
        e.target.classList.remove('puzzles__item--hide')

        const cell = this.elements.cells[index]


        const leftDiff = Math.abs(this.elements.empty.left - cell.left)
        const topDiff = Math.abs(this.elements.empty.top - cell.top)

        if (leftDiff + topDiff > 1) {
            return
        }

        cell.element.style = `top: ${this.elements.empty.top * this.properties.cellSize}%;
                          left: ${this.elements.empty.left * this.properties.cellSize}%;
                          width: ${this.properties.cellSize}%;
                          height: ${this.properties.cellSize}%`

        const emptyLeft = this.elements.empty.left
        const emptyTop = this.elements.empty.top
        this.elements.empty.left = cell.left
        this.elements.empty.top = cell.top
        cell.left = emptyLeft
        cell.top = emptyTop

        const isFinished = this.elements.cells.every(cell => {
            return cell.value === cell.top * 4 + cell.left
        })

        function greetWinner() {
            alert('Congratulations! You won!')
        }

        if (isFinished) {
            setTimeout(greetWinner, 600)
        }

    },

    _dragOver(e){
        e.preventDefault();

        // console.log('over');

    },
    _dragEnter(e){
        e.preventDefault();
        console.log('Enter');
        this.classList.add('puzzles--hovered')
        // console.log(this);
        // this.elements.puzzlesContainer.classList.add('puzzles--hovered')
    },

    _dragLeave(){
        console.log('Leave');
        this.classList.remove('puzzles--hovered')
    },

    _dragDrop(){
        console.log('drop');
        this.classList.remove('puzzles--hovered')
    },
}

window.addEventListener('DOMContentLoaded', () => {
    gemPuzzle.init()
})
