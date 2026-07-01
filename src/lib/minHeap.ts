export interface HeapNode {
  priority: number
  row: number
  col: number
}

export class MinHeap {
  private data: HeapNode[] = []

  get size() { return this.data.length }
  get isEmpty() { return this.data.length === 0 }

  push(node: HeapNode) {
    this.data.push(node)
    this.bubbleUp(this.data.length - 1)
  }

  pop(): HeapNode | undefined {
    if (this.data.length === 0) return undefined
    const top = this.data[0]
    const last = this.data.pop()!
    if (this.data.length > 0) {
      this.data[0] = last
      this.sinkDown(0)
    }
    return top
  }

  private bubbleUp(i: number) {
    while (i > 0) {
      const parent = (i - 1) >> 1
      if (this.data[parent].priority <= this.data[i].priority) break
      ;[this.data[parent], this.data[i]] = [this.data[i], this.data[parent]]
      i = parent
    }
  }

  private sinkDown(i: number) {
    const n = this.data.length
    while (true) {
      let smallest = i
      const l = 2 * i + 1
      const r = 2 * i + 2
      if (l < n && this.data[l].priority < this.data[smallest].priority) smallest = l
      if (r < n && this.data[r].priority < this.data[smallest].priority) smallest = r
      if (smallest === i) break
      ;[this.data[smallest], this.data[i]] = [this.data[i], this.data[smallest]]
      i = smallest
    }
  }
}
