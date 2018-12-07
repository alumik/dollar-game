const BEFORE_GAME = 0
const IN_GAME = 1

let font
let background_color
let game_stage = BEFORE_GAME
let edges_count = 0
let cells = []
let cell_index = 0
let cell_active
let cell_dragged
let cell_pressed
let animations = []

function preload() {
    font = loadFont('font/AmericanTypewriterStd-Med.otf')
}

function setup() {
    createCanvas(windowWidth, windowHeight - 50)
    cell_dragged = new Cell(0, 0)
    background_color = 255
    createDefaultGame()
}

function draw() {
    background(background_color)
    mouseDragHandler()
    for (let cell of cells) {
        cell.showEdge()
        cell.show()
    }
    for (let animation of animations) {
        animation.run()
    }
    if (frameCount % 600 === 0) {
        let to_be_deleted = []
        for (let animation of animations) {
            if (animation.stage === 3) {
                to_be_deleted.push(animation)
            }
        }
        for (let animation of to_be_deleted) {
            animations.splice(animations.indexOf(animation), 1)
        }
    }
    showMode()
}

function mousePressed() {
    cell_pressed = null
    if (game_stage === BEFORE_GAME) {
        if (cell_active) {
            cell_active.active = false
            cell_active.new_input = true
        }
        cell_active = null
        let current_cell = getCell()
        if (mouseButton === LEFT) {
            if (current_cell) {
                cell_pressed = current_cell
            } else if (!nearCell()) {
                let new_cell = new Cell(mouseX, mouseY, cell_index++)
                cells.push(new_cell)
                cell_pressed = new_cell
            }
        } else if (mouseButton === RIGHT) {
            cell_pressed = current_cell
        }
    } else if (game_stage === IN_GAME) {
        let in_cell = getCell()
        if (in_cell) {
            cell_pressed = in_cell
        }
    }
}

function mouseReleased() {
    if (game_stage === BEFORE_GAME) {
        if (mouseButton === LEFT && cell_pressed) {
            let current_cell = getCell()
            if (current_cell) {
                if (current_cell === cell_pressed) {
                    current_cell.active = true
                    cell_active = current_cell
                } else {
                    if (cell_pressed.neighbors.indexOf(current_cell) === -1) {
                        cell_pressed.neighbors.push(current_cell)
                        current_cell.neighbors.push(cell_pressed)
                        edges_count++
                    }
                }
            } else if (!nearCell()) {
                let new_cell = new Cell(mouseX, mouseY, cell_index++)
                cells.push(new_cell)
                cell_pressed.neighbors.push(new_cell)
                new_cell.neighbors.push(cell_pressed)
                new_cell.active = true
                cell_active = new_cell
                edges_count++
            }
        }
    } else if (game_stage === IN_GAME) {
        let current_cell = getCell()
        if (current_cell && current_cell === cell_pressed) {
            if (mouseButton === LEFT) {
                animations.push(new CellAnimation(current_cell, CellAnimation.OUT))
                for (let neighbor of current_cell.neighbors) {
                    current_cell.num--
                    neighbor.num++
                    neighbor.recalculateTextSize()
                }
            } else if (mouseButton === RIGHT) {
                animations.push(new CellAnimation(current_cell, CellAnimation.IN))
                for (let neighbor of current_cell.neighbors) {
                    current_cell.num++
                    neighbor.num--
                    neighbor.recalculateTextSize()
                }
            }
            current_cell.recalculateTextSize()
            checkWin()
        }
    }
}

function mouseMoved() {
    getCell()
}

function keyPressed() {
    if (game_stage === BEFORE_GAME && cell_active) {
        if (key >= '0' && key <= '9') {
            if (cell_active.new_input) {
                cell_active.num = parseInt(key)
                cell_active.new_input = false
            } else {
                cell_active.num = parseInt('' + cell_active.num + key)
            }
            cell_active.show_num = true
        } else if (key === '-') {
            cell_active.num = -cell_active.num
        } else if (key === 'Delete') {
            cells.splice(cells.indexOf(cell_active), 1)
            for (let neighbor of cell_active.neighbors) {
                neighbor.neighbors.splice(neighbor.neighbors.indexOf(cell_active), 1)
                edges_count--
            }
        }
    }
    if (key === 'Enter') {
        if (validateGame()) {
            if (cell_active) {
                cell_active.active = false
            }
            game_stage = IN_GAME
        } else {
            alert('游戏设置不正确!')
        }
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight - 50)
}

function mouseDragHandler() {
    if (game_stage === BEFORE_GAME && mouseIsPressed && cell_pressed) {
        if (mouseButton === LEFT) {
            if (dist(mouseX, mouseY, cell_pressed.pos.x, cell_pressed.pos.y) > cell_pressed.size / 2) {
                cell_dragged.pos.x = mouseX
                cell_dragged.pos.y = mouseY
                Cell.showEdge(cell_pressed, cell_dragged)
                cell_dragged.show()
            }
        } else if (mouseButton === RIGHT) {
            cell_pressed.pos.x = mouseX
            cell_pressed.pos.y = mouseY
        }
    }
}

function getCell() {
    let current_cell
    for (let cell of cells) {
        if (dist(mouseX, mouseY, cell.pos.x, cell.pos.y) <= cell.size / 2) {
            current_cell = cell
            cell.mouse_in = true
        } else {
            cell.mouse_in = false
        }
    }
    return current_cell
}

function nearCell() {
    for (let cell of cells) {
        if (dist(mouseX, mouseY, cell.pos.x, cell.pos.y) <= cell.size) {
            return true
        }
    }
    return false
}

function validateGame() {
    let sum = 0
    for (let cell of cells) {
        sum += cell.num
        if (!cell.show_num) {
            return false
        }
    }
    return edges_count - cells.length + 1 <= sum
}

function checkWin() {
    let win = true
    for (let cell of cells) {
        if (cell.num < 0) {
            win = false
        }
    }
    if (win) {
        background_color = color(0, 180, 0)
    } else {
        background_color = 255
    }
}

function showMode() {
    noStroke()
    textAlign(CENTER, TOP)
    textFont('Aria')
    textStyle(BOLD)
    textSize(25)
    fill(49)
    if (game_stage === BEFORE_GAME) {
        text('编辑模式', width / 2, 10)
    } else {
        text('游戏模式', width / 2, 10)
    }
}
