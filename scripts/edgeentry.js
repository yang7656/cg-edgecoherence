class EdgeEntry {
    constructor(y_max, x_ymin, delta_x, delta_y) {
        if (y_max instanceof EdgeEntry) {
            this.y_max = y_max.y_max;
            this.x = y_max.x;
            this.inv_slope = y_max.inv_slope;
            this.next_entry = null;
        }
        else {
            this.y_max = y_max;
            this.x = x_ymin;
            this.inv_slope = delta_x / delta_y;
            this.next_entry = null;
        }
    }
};

class EdgeList {
    constructor() {
        this.first_entry = null;
    }
    InsertEdge(edge) {
        let new_edge = new EdgeEntry(edge);
        if (this.first_entry === null) {
            this.first_entry = new_edge;
        }
        else if (new_edge.x < this.first_entry.x) {
            new_edge.next_entry = this.first_entry;
            this.first_entry = new_edge;
        }
        else {
            let prev_entry = this.first_entry;
            let next_entry = prev_entry.next_entry;
            while (next_entry !== null && new_edge.x >= next_entry.x) {
                prev_entry = next_entry;
                next_entry = next_entry.next_entry;
            }
            new_edge.next_entry = next_entry;
            prev_entry.next_entry = new_edge;
        }
    }
    RemoveCompleteEdges(y) {
        if (this.first_entry !== null) {
            let prev_entry = this.first_entry;
            let next_entry = prev_entry.next_entry;
            while (next_entry !== null) {
                if (next_entry.y_max === y) {
                    prev_entry.next_entry = next_entry.next_entry;
                }
                else {
                    prev_entry = next_entry;
                }
                next_entry = prev_entry.next_entry;
            }
            if (this.first_entry.y_max === y) {
                this.first_entry = this.first_entry.next_entry;
            }
        }
    }
    SortList() {
        let curr_entry = null;
        let swapped = false;
        do {
            curr_entry = this.first_entry;
            swapped = false;
            while (curr_entry.next_entry !== null) {
                if (curr_entry.x > curr_entry.next_entry.x) {
                    let tmp_y_max = curr_entry.y_max;
                    let tmp_x = curr_entry.x;
                    let tmp_inv_slope = curr_entry.inv_slope;
                    curr_entry.y_max = curr_entry.next_entry.y_max;
                    curr_entry.x = curr_entry.next_entry.x;
                    curr_entry.inv_slope = curr_entry.next_entry.inv_slope;
                    curr_entry.next_entry.y_max = tmp_y_max;
                    curr_entry.next_entry.x = tmp_x;
                    curr_entry.next_entry.inv_slope = tmp_inv_slope;
                    swapped = true;
                }
                curr_entry = curr_entry.next_entry;
            }
        } while (swapped);
    }
};
