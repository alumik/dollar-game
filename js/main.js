const BEFORE_GAME = 0
const IN_GAME = 1

let g_game_state = BEFORE_GAME
let g_edges_count = 0
let g_cell_index = 0
let background_color
let c_active_cell
let c_drag_cell
let c_press_cell
let c_animate_cell
let cells = []
let animation

function setup() {
    createCanvas(1024, 768)
    c_drag_cell = new Cell(0, 0, null)
    background_color = color(180)
    createDefaultGame()
}

function draw() {
    background(background_color)
    mouseDragHandler()
    for (let cell of cells) {
        cell.showLink()
    }
    if (animation) {
        animation.run()
    }
    for (let cell of cells) {
        cell.show()
    }
}

function mousePressed() {
    c_press_cell = null
    if (g_game_state === BEFORE_GAME) {
        if (c_active_cell) {
            c_active_cell.flipState()
            c_active_cell.new_input = true
        }
        c_active_cell = null
        let in_cell = getInCell()
        if (mouseButton === LEFT) {
            if (in_cell) {
                c_press_cell = in_cell
            } else if (!isNear()) {
                let new_cell = new Cell(mouseX, mouseY, g_cell_index++)
                cells.push(new_cell)
                c_press_cell = new_cell
            }
        } else if (mouseButton === RIGHT) {
            c_press_cell = in_cell
        }
    } else if (g_game_state === IN_GAME) {
        let in_cell = getInCell()
        if (in_cell) {
            c_press_cell = in_cell
        }
    }
}

function mouseReleased() {
    if (g_game_state === BEFORE_GAME) {
        if (mouseButton === LEFT) {
            for (let cell of cells) {
                if (dist(mouseX, mouseY, cell.pos.x, cell.pos.y) <= cell.size / 2) {
                    if (cell === c_press_cell) {
                        cell.flipState()
                        c_active_cell = cell
                    } else {
                        if (c_press_cell.neighbors.indexOf(cell) === -1) {
                            c_press_cell.neighbors.push(cell)
                            cell.neighbors.push(c_press_cell)
                            g_edges_count++
                        }
                    }
                    return
                }
            }
            if (!isNear()) {
                console.log(c_press_cell)
                let new_cell = new Cell(mouseX, mouseY, g_cell_index++)
                cells.push(new_cell)
                c_press_cell.neighbors.push(new_cell)
                new_cell.neighbors.push(c_press_cell)
                new_cell.flipState()
                c_active_cell = new_cell
                g_edges_count++
            }
        }
    } else if (g_game_state === IN_GAME) {
        let in_cell = getInCell()
        if (in_cell && in_cell === c_press_cell) {
            if (mouseButton === LEFT) {
                animation = new CellAnimation(in_cell, CellAnimation.OUT)
                for (let neighbor of in_cell.neighbors) {
                    in_cell.num--
                    neighbor.num++
                }
            } else if (mouseButton === RIGHT) {
                animation = new CellAnimation(in_cell, CellAnimation.IN)
                for (let neighbor of in_cell.neighbors) {
                    in_cell.num++
                    neighbor.num--
                }
            }
            checkWin()
        }
    }
    return false
}

function mouseMoved() {
    getInCell()
}

function keyPressed() {
    if (c_active_cell && g_game_state === BEFORE_GAME) {
        if (key >= '0' && key <= '9') {
            if (c_active_cell.new_input) {
                c_active_cell.num = parseInt(key)
                c_active_cell.new_input = false
            } else {
                c_active_cell.num = parseInt('' + c_active_cell.num + key)
            }
            c_active_cell.show_num = true
        } else if (key === '-') {
            c_active_cell.num = -c_active_cell.num
        } else if (key === 'Delete') {
            cells.splice(cells.indexOf(c_active_cell), 1)
            for (let neighbor of c_active_cell.neighbors) {
                neighbor.neighbors.splice(neighbor.neighbors.indexOf(c_active_cell), 1)
                g_edges_count--
            }
        }
    }
    if (key === 'Enter') {
        if (checkGame()) {
            if (c_active_cell) {
                c_active_cell.flipState()
            }
            g_game_state = IN_GAME
        } else {
            alert('游戏参数不正确!')
        }
    }
}

function mouseDragHandler() {
    if (g_game_state === BEFORE_GAME && mouseIsPressed && c_press_cell) {
        if (mouseButton === LEFT) {
            if (dist(mouseX, mouseY, c_press_cell.pos.x, c_press_cell.pos.y) > c_press_cell.size / 2) {
                c_drag_cell.pos.x = mouseX
                c_drag_cell.pos.y = mouseY
                c_drag_cell.show()
                Cell.showLink(c_press_cell, c_drag_cell)
            }
        } else if (mouseButton === RIGHT) {
            c_press_cell.pos.x = mouseX
            c_press_cell.pos.y = mouseY
        }
    }
}

function getInCell() {
    let in_cell
    for (let cell of cells) {
        if (dist(mouseX, mouseY, cell.pos.x, cell.pos.y) <= cell.size / 2) {
            in_cell = cell
            cell.mouse_in = true
        } else {
            cell.mouse_in = false
        }
    }
    return in_cell
}

function isNear() {
    for (let cell of cells) {
        if (dist(mouseX, mouseY, cell.pos.x, cell.pos.y) <= cell.size) {
            return true
        }
    }
    return false
}

function checkGame() {
    let sum = 0
    for (let cell of cells) {
        sum += cell.num
        if (!cell.show_num) {
            return false
        }
    }
    console.log(g_edges_count - cells.length + 1 - sum)
    return g_edges_count - cells.length + 1 <= sum
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
        console.log('游戏成功！')
    } else {
        background_color = color(180)
    }
}
