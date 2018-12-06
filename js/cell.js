class Cell {
    constructor(x, y, index) {
        this.index = index
        this.size = 40
        this.pos = createVector(x, y)
        this.num = 0
        this.neighbors = []
        this.active = false
        this.mouse_in = false
        this.show_num = false
        this.new_input = true
    }

    show() {
        this.showAt(this.size, 0, 255)
    }

    showAt(size, color, text_color) {
        noStroke()
        fill(color)
        ellipse(this.pos.x, this.pos.y, size, size)

        if (this.show_num) {
            textAlign(CENTER, CENTER)
            textSize(20)
            fill(text_color)
            text(this.num, this.pos.x, this.pos.y)
        }

        if (this.active) {
            stroke(0, 255, 0)
            strokeWeight(3)
            noFill()
            ellipse(this.pos.x, this.pos.y, size, size)
        }

        if (this.mouse_in) {
            stroke(255)
            strokeWeight(3)
            noFill()
            ellipse(this.pos.x, this.pos.y, size, size)
        }
    }

    showEdge() {
        for (let neighor of this.neighbors) {
            if (this.index < neighor.index) {
                Cell.showEdge(this, neighor)
            }
        }
    }

    static showEdge(cell_a, cell_b) {
        stroke(0)
        strokeWeight(5)
        line(cell_a.pos.x, cell_a.pos.y, cell_b.pos.x, cell_b.pos.y)
    }
}
