function createDefaultGame() {
    let a = new Cell(width / 2, height / 2 - 100, 0)
    let b = new Cell(width / 2 + 100, height / 2, 1)
    let c = new Cell(width / 2 - 100, height / 2, 2)
    let d = new Cell(width / 2, height / 2 + 100, 3)
    let e = new Cell(width / 2 - 100, height / 2 + 100, 4)
    a.num = 1
    b.num = -2
    c.num = -1
    d.num = 3
    e.num = 2
    a.show_num = true
    b.show_num = true
    c.show_num = true
    d.show_num = true
    e.show_num = true
    a.neighbors.push(b, d)
    b.neighbors.push(a, c, d)
    c.neighbors.push(b)
    d.neighbors.push(a, b, e)
    e.neighbors.push(d)
    c_cells.push(a, b, c, d, e)
    g_cell_index = 5
    g_edges_count = 5
}
