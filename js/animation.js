class CellAnimation {
    constructor(cell, direction) {
        this.step = 1 / 30
        this.progress = 0
        this.cell = cell
        this.direction = direction
        this.running = true
    }

    run() {
        if (this.running) {
            for (let neighbor of this.cell.neighbors) {
                let animation_pos
                if (this.direction === CellAnimation.OUT) {
                    animation_pos = p5.Vector.lerp(this.cell.pos, neighbor.pos, this.progress)
                } else {
                    animation_pos = p5.Vector.lerp(neighbor.pos, this.cell.pos, this.progress)
                }
                noStroke()
                fill(255, 255, 0)
                ellipse(animation_pos.x, animation_pos.y, 20, 20)
            }
            this.progress += this.step
            if (this.progress > 1) {
                this.running = false
            }
        }
    }
}

CellAnimation.IN = true
CellAnimation.OUT = false
