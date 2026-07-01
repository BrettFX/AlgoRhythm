import type { SearchAlgorithmMeta } from '@/types'
import { generateFrames as linearFrames } from '@/algorithms/search/linearSearch'
import { generateFrames as binaryFrames } from '@/algorithms/search/binarySearch'
import { generateFrames as jumpFrames } from '@/algorithms/search/jumpSearch'
import { generateFrames as interpolationFrames } from '@/algorithms/search/interpolationSearch'
import { generateFrames as exponentialFrames } from '@/algorithms/search/exponentialSearch'
import { generateFrames as bfsFrames } from '@/algorithms/search/bfs'
import { generateFrames as dfsFrames } from '@/algorithms/search/dfs'
import { generateFrames as aStarFrames } from '@/algorithms/search/aStar'

export const ARRAY_SEARCH_META: SearchAlgorithmMeta[] = [
  {
    id: 'linear-search',
    name: 'Linear Search',
    category: 'array',
    description:
      'Scans each element one by one from the start until the target is found or the list is exhausted. Works on unsorted arrays. Simple and universally applicable, but slow for large collections. The go-to choice when the data is unsorted or the list is very small.',
    complexity: { best: 'O(1)', average: 'O(n)', worst: 'O(n)', space: 'O(1)' },
    generateArray: linearFrames,
    snippets: {
      python: `def linear_search(arr, target):
    for i, v in enumerate(arr):
        if v == target:
            return i
    return -1`,
      javascript: `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}`,
      java: `int linearSearch(int[] arr, int target) {
  for (int i = 0; i < arr.length; i++)
    if (arr[i] == target) return i;
  return -1;
}`,
      rust: `fn linear_search(arr: &[i32], target: i32) -> Option<usize> {
  arr.iter().position(|&v| v == target)
}`,
      cpp: `int linearSearch(const vector<int>& arr, int target) {
  for (int i = 0; i < arr.size(); i++)
    if (arr[i] == target) return i;
  return -1;
}`,
    },
  },
  {
    id: 'binary-search',
    name: 'Binary Search',
    category: 'array',
    description:
      'Requires a sorted array. Compares the target to the middle element, then eliminates half the search space based on whether the target is smaller or larger. Extremely efficient — searching one billion elements takes at most 30 comparisons. The standard search algorithm for sorted data.',
    complexity: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)', space: 'O(1)' },
    generateArray: binaryFrames,
    snippets: {
      python: `def binary_search(arr, target):
    lo, hi = 0, len(arr) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if arr[mid] == target: return mid
        elif arr[mid] < target: lo = mid + 1
        else: hi = mid - 1
    return -1`,
      javascript: `function binarySearch(arr, target) {
  let lo = 0, hi = arr.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (arr[mid] === target) return mid;
    else if (arr[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}`,
      java: `int binarySearch(int[] arr, int target) {
  int lo = 0, hi = arr.length - 1;
  while (lo <= hi) {
    int mid = (lo + hi) >>> 1;
    if (arr[mid] == target) return mid;
    else if (arr[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}`,
      rust: `fn binary_search(arr: &[i32], target: i32) -> Option<usize> {
  let (mut lo, mut hi) = (0usize, arr.len());
  while lo < hi {
    let mid = lo + (hi - lo) / 2;
    match arr[mid].cmp(&target) {
      std::cmp::Ordering::Equal => return Some(mid),
      std::cmp::Ordering::Less => lo = mid + 1,
      std::cmp::Ordering::Greater => hi = mid,
    }
  }
  None
}`,
      cpp: `int binarySearch(const vector<int>& arr, int target) {
  int lo = 0, hi = arr.size() - 1;
  while (lo <= hi) {
    int mid = lo + (hi - lo) / 2;
    if (arr[mid] == target) return mid;
    else if (arr[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}`,
    },
  },
  {
    id: 'jump-search',
    name: 'Jump Search',
    category: 'array',
    description:
      'Divides the sorted array into blocks of size √n. Jumps ahead block by block until the block containing the target is identified, then does a linear scan within that block. Faster than linear search, simpler than binary search. Well-suited for sorted arrays where backward traversal is costly (e.g. tapes).',
    complexity: { best: 'O(1)', average: 'O(√n)', worst: 'O(√n)', space: 'O(1)' },
    generateArray: jumpFrames,
    snippets: {
      python: `import math

def jump_search(arr, target):
    n = len(arr)
    step = int(math.sqrt(n))
    prev = 0
    while arr[min(step, n) - 1] < target:
        prev = step
        step += int(math.sqrt(n))
        if prev >= n:
            return -1
    for i in range(prev, min(step, n)):
        if arr[i] == target:
            return i
    return -1`,
      javascript: `function jumpSearch(arr, target) {
  const n = arr.length;
  const step = Math.floor(Math.sqrt(n));
  let prev = 0;
  while (arr[Math.min(prev + step, n) - 1] < target) {
    prev += step;
    if (prev >= n) return -1;
  }
  for (let i = prev; i < Math.min(prev + step, n); i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}`,
      java: `int jumpSearch(int[] arr, int target) {
  int n = arr.length, step = (int) Math.sqrt(n), prev = 0;
  while (arr[Math.min(step, n) - 1] < target) {
    prev = step; step += (int) Math.sqrt(n);
    if (prev >= n) return -1;
  }
  for (int i = prev; i < Math.min(step, n); i++)
    if (arr[i] == target) return i;
  return -1;
}`,
      rust: `fn jump_search(arr: &[i32], target: i32) -> Option<usize> {
  let n = arr.len();
  let step = (n as f64).sqrt() as usize;
  let mut prev = 0;
  while arr[step.min(n) - 1] < target {
    prev += step;
    if prev >= n { return None; }
  }
  (prev..step.min(n)).find(|&i| arr[i] == target)
}`,
      cpp: `int jumpSearch(const vector<int>& arr, int target) {
  int n = arr.size(), step = sqrt(n), prev = 0;
  while (arr[min(step, n) - 1] < target) {
    prev = step; step += sqrt(n);
    if (prev >= n) return -1;
  }
  for (int i = prev; i < min(step, n); i++)
    if (arr[i] == target) return i;
  return -1;
}`,
    },
  },
  {
    id: 'interpolation-search',
    name: 'Interpolation Search',
    category: 'array',
    description:
      'An improvement over binary search for uniformly distributed sorted arrays. Instead of always probing the midpoint, it estimates the position using linear interpolation based on the target value. Achieves O(log log n) on uniform data — near-constant for large sorted arrays of integers.',
    complexity: { best: 'O(1)', average: 'O(log log n)', worst: 'O(n)', space: 'O(1)' },
    generateArray: interpolationFrames,
    snippets: {
      python: `def interpolation_search(arr, target):
    lo, hi = 0, len(arr) - 1
    while lo <= hi and arr[lo] <= target <= arr[hi]:
        if arr[hi] == arr[lo]:
            if arr[lo] == target: return lo
            break
        pos = lo + (target - arr[lo]) * (hi - lo) // (arr[hi] - arr[lo])
        if arr[pos] == target: return pos
        elif arr[pos] < target: lo = pos + 1
        else: hi = pos - 1
    return -1`,
      javascript: `function interpolationSearch(arr, target) {
  let lo = 0, hi = arr.length - 1;
  while (lo <= hi && target >= arr[lo] && target <= arr[hi]) {
    if (arr[lo] === arr[hi])
      return arr[lo] === target ? lo : -1;
    const pos = lo + Math.floor((target - arr[lo]) * (hi - lo) / (arr[hi] - arr[lo]));
    if (arr[pos] === target) return pos;
    else if (arr[pos] < target) lo = pos + 1;
    else hi = pos - 1;
  }
  return -1;
}`,
      java: `int interpolationSearch(int[] arr, int target) {
  int lo = 0, hi = arr.length - 1;
  while (lo <= hi && target >= arr[lo] && target <= arr[hi]) {
    if (arr[lo] == arr[hi]) return arr[lo] == target ? lo : -1;
    int pos = lo + (target - arr[lo]) * (hi - lo) / (arr[hi] - arr[lo]);
    if (arr[pos] == target) return pos;
    else if (arr[pos] < target) lo = pos + 1;
    else hi = pos - 1;
  }
  return -1;
}`,
      rust: `fn interpolation_search(arr: &[i32], target: i32) -> Option<usize> {
  let (mut lo, mut hi) = (0usize, arr.len() - 1);
  while lo <= hi && target >= arr[lo] && target <= arr[hi] {
    if arr[hi] == arr[lo] {
      return if arr[lo] == target { Some(lo) } else { None };
    }
    let pos = lo + ((target - arr[lo]) * (hi - lo) as i32 / (arr[hi] - arr[lo])) as usize;
    if arr[pos] == target { return Some(pos); }
    else if arr[pos] < target { lo = pos + 1; }
    else { hi = pos - 1; }
  }
  None
}`,
      cpp: `int interpolationSearch(const vector<int>& arr, int target) {
  int lo = 0, hi = arr.size() - 1;
  while (lo <= hi && target >= arr[lo] && target <= arr[hi]) {
    if (arr[lo] == arr[hi]) return arr[lo] == target ? lo : -1;
    int pos = lo + (long long)(target - arr[lo]) * (hi - lo) / (arr[hi] - arr[lo]);
    if (arr[pos] == target) return pos;
    else if (arr[pos] < target) lo = pos + 1;
    else hi = pos - 1;
  }
  return -1;
}`,
    },
  },
  {
    id: 'exponential-search',
    name: 'Exponential Search',
    category: 'array',
    description:
      'First finds a range where the target might exist by doubling the index (1, 2, 4, 8…), then applies binary search within that range. Very effective for unbounded or infinite sorted lists. Also useful when the target is near the beginning of the array — it reaches nearby elements faster than standard binary search.',
    complexity: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)', space: 'O(1)' },
    generateArray: exponentialFrames,
    snippets: {
      python: `def exponential_search(arr, target):
    if arr[0] == target: return 0
    n, i = len(arr), 1
    while i < n and arr[i] <= target:
        i *= 2
    return binary_search(arr, target, i // 2, min(i, n - 1))

def binary_search(arr, target, lo, hi):
    while lo <= hi:
        mid = (lo + hi) // 2
        if arr[mid] == target: return mid
        elif arr[mid] < target: lo = mid + 1
        else: hi = mid - 1
    return -1`,
      javascript: `function exponentialSearch(arr, target) {
  if (arr[0] === target) return 0;
  let i = 1;
  while (i < arr.length && arr[i] <= target) i *= 2;
  return binarySearch(arr, target, i >> 1, Math.min(i, arr.length - 1));
}
function binarySearch(arr, target, lo, hi) {
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (arr[mid] === target) return mid;
    else if (arr[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}`,
      java: `int exponentialSearch(int[] arr, int target) {
  if (arr[0] == target) return 0;
  int i = 1, n = arr.length;
  while (i < n && arr[i] <= target) i *= 2;
  return binarySearch(arr, target, i / 2, Math.min(i, n - 1));
}
int binarySearch(int[] arr, int target, int lo, int hi) {
  while (lo <= hi) {
    int mid = (lo + hi) >>> 1;
    if (arr[mid] == target) return mid;
    else if (arr[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}`,
      rust: `fn exponential_search(arr: &[i32], target: i32) -> Option<usize> {
  if arr[0] == target { return Some(0); }
  let n = arr.len();
  let mut i = 1;
  while i < n && arr[i] <= target { i *= 2; }
  binary_search(&arr[i/2..i.min(n)], target).map(|idx| idx + i/2)
}
fn binary_search(arr: &[i32], target: i32) -> Option<usize> {
  arr.binary_search(&target).ok()
}`,
      cpp: `int exponentialSearch(const vector<int>& arr, int target) {
  if (arr[0] == target) return 0;
  int i = 1, n = arr.size();
  while (i < n && arr[i] <= target) i *= 2;
  return binarySearch(arr, target, i/2, min(i, n-1));
}
int binarySearch(const vector<int>& arr, int target, int lo, int hi) {
  while (lo <= hi) {
    int mid = lo + (hi-lo)/2;
    if (arr[mid] == target) return mid;
    else if (arr[mid] < target) lo = mid+1;
    else hi = mid-1;
  }
  return -1;
}`,
    },
  },
]

export const GRAPH_SEARCH_META: SearchAlgorithmMeta[] = [
  {
    id: 'bfs',
    name: 'Breadth-First Search',
    category: 'graph',
    description:
      'Explores a graph level by level using a queue. Visits all neighbors of a node before moving to the next level. Guarantees the shortest path in an unweighted graph. The classic algorithm for shortest-path problems, web crawling, and social network analysis.',
    complexity: { best: 'O(V+E)', average: 'O(V+E)', worst: 'O(V+E)', space: 'O(V)' },
    generateGrid: bfsFrames,
    snippets: {
      python: `from collections import deque

def bfs(grid, start, goal):
    queue = deque([start])
    visited = {start: None}
    while queue:
        node = queue.popleft()
        if node == goal:
            return reconstruct_path(visited, goal)
        for neighbor in get_neighbors(grid, node):
            if neighbor not in visited:
                visited[neighbor] = node
                queue.append(neighbor)
    return None`,
      javascript: `function bfs(grid, start, goal) {
  const queue = [start];
  const parent = new Map([[start, null]]);
  while (queue.length) {
    const node = queue.shift();
    if (node === goal) return reconstructPath(parent, goal);
    for (const nb of getNeighbors(grid, node)) {
      if (!parent.has(nb)) {
        parent.set(nb, node);
        queue.push(nb);
      }
    }
  }
  return null;
}`,
      java: `List<int[]> bfs(int[][] grid, int[] start, int[] goal) {
  Queue<int[]> q = new LinkedList<>();
  Map<String, int[]> parent = new HashMap<>();
  q.add(start); parent.put(key(start), null);
  while (!q.isEmpty()) {
    int[] node = q.poll();
    if (Arrays.equals(node, goal)) return buildPath(parent, goal);
    for (int[] nb : neighbors(grid, node))
      if (!parent.containsKey(key(nb))) {
        parent.put(key(nb), node); q.add(nb);
      }
  }
  return null;
}`,
      rust: `use std::collections::{VecDeque, HashMap};
fn bfs(grid: &Vec<Vec<char>>, start: (usize,usize), goal: (usize,usize))
  -> Option<Vec<(usize,usize)>> {
  let mut queue = VecDeque::from([start]);
  let mut parent: HashMap<(usize,usize), Option<(usize,usize)>> = HashMap::new();
  parent.insert(start, None);
  while let Some(node) = queue.pop_front() {
    if node == goal { return Some(reconstruct(&parent, goal)); }
    for nb in neighbors(grid, node) {
      if !parent.contains_key(&nb) {
        parent.insert(nb, Some(node));
        queue.push_back(nb);
      }
    }
  }
  None
}`,
      cpp: `vector<pair<int,int>> bfs(vector<vector<char>>& grid,
    pair<int,int> start, pair<int,int> goal) {
  queue<pair<int,int>> q;
  map<pair<int,int>, pair<int,int>> parent;
  q.push(start); parent[start] = {-1,-1};
  while (!q.empty()) {
    auto node = q.front(); q.pop();
    if (node == goal) return buildPath(parent, goal);
    for (auto& nb : neighbors(grid, node))
      if (!parent.count(nb)) { parent[nb] = node; q.push(nb); }
  }
  return {};
}`,
    },
  },
  {
    id: 'dfs',
    name: 'Depth-First Search',
    category: 'graph',
    description:
      'Explores as far as possible along each branch before backtracking, using a stack. Does not guarantee the shortest path. Uses less memory than BFS in many cases. Essential for topological sorting, cycle detection, maze generation, and connected component analysis.',
    complexity: { best: 'O(V+E)', average: 'O(V+E)', worst: 'O(V+E)', space: 'O(V)' },
    generateGrid: dfsFrames,
    snippets: {
      python: `def dfs(grid, start, goal):
    stack = [start]
    visited = {start: None}
    while stack:
        node = stack.pop()
        if node == goal:
            return reconstruct_path(visited, goal)
        for neighbor in get_neighbors(grid, node):
            if neighbor not in visited:
                visited[neighbor] = node
                stack.append(neighbor)
    return None`,
      javascript: `function dfs(grid, start, goal) {
  const stack = [start];
  const parent = new Map([[start, null]]);
  while (stack.length) {
    const node = stack.pop();
    if (node === goal) return reconstructPath(parent, goal);
    for (const nb of getNeighbors(grid, node)) {
      if (!parent.has(nb)) {
        parent.set(nb, node);
        stack.push(nb);
      }
    }
  }
  return null;
}`,
      java: `List<int[]> dfs(int[][] grid, int[] start, int[] goal) {
  Deque<int[]> stack = new ArrayDeque<>();
  Map<String, int[]> parent = new HashMap<>();
  stack.push(start); parent.put(key(start), null);
  while (!stack.isEmpty()) {
    int[] node = stack.pop();
    if (Arrays.equals(node, goal)) return buildPath(parent, goal);
    for (int[] nb : neighbors(grid, node))
      if (!parent.containsKey(key(nb))) {
        parent.put(key(nb), node); stack.push(nb);
      }
  }
  return null;
}`,
      rust: `fn dfs(grid: &Vec<Vec<char>>, start: (usize,usize), goal: (usize,usize))
  -> Option<Vec<(usize,usize)>> {
  let mut stack = vec![start];
  let mut parent: HashMap<(usize,usize), Option<(usize,usize)>> = HashMap::new();
  parent.insert(start, None);
  while let Some(node) = stack.pop() {
    if node == goal { return Some(reconstruct(&parent, goal)); }
    for nb in neighbors(grid, node) {
      if !parent.contains_key(&nb) {
        parent.insert(nb, Some(node));
        stack.push(nb);
      }
    }
  }
  None
}`,
      cpp: `vector<pair<int,int>> dfs(vector<vector<char>>& grid,
    pair<int,int> start, pair<int,int> goal) {
  stack<pair<int,int>> s;
  map<pair<int,int>, pair<int,int>> parent;
  s.push(start); parent[start] = {-1,-1};
  while (!s.empty()) {
    auto node = s.top(); s.pop();
    if (node == goal) return buildPath(parent, goal);
    for (auto& nb : neighbors(grid, node))
      if (!parent.count(nb)) { parent[nb] = node; s.push(nb); }
  }
  return {};
}`,
    },
  },
  {
    id: 'a-star',
    name: 'A* Search',
    category: 'graph',
    description:
      'A best-first search that combines the actual cost from the start (g) with a heuristic estimate to the goal (h), prioritizing nodes with the lowest f = g + h. Uses a priority queue. Guarantees the shortest path when the heuristic is admissible (never overestimates). The go-to algorithm for pathfinding in games and maps.',
    complexity: { best: 'O(E log V)', average: 'O(E log V)', worst: 'O(E log V)', space: 'O(V)' },
    generateGrid: aStarFrames,
    snippets: {
      python: `import heapq

def a_star(grid, start, goal):
    h = lambda n: abs(n[0]-goal[0]) + abs(n[1]-goal[1])
    open_set = [(h(start), 0, start)]
    g = {start: 0}
    parent = {start: None}
    while open_set:
        _, cost, node = heapq.heappop(open_set)
        if node == goal:
            return reconstruct_path(parent, goal)
        for nb in get_neighbors(grid, node):
            new_g = cost + 1
            if nb not in g or new_g < g[nb]:
                g[nb] = new_g
                parent[nb] = node
                heapq.heappush(open_set, (new_g + h(nb), new_g, nb))
    return None`,
      javascript: `function aStar(grid, start, goal) {
  const h = ([r,c]) => Math.abs(r-goal[0]) + Math.abs(c-goal[1]);
  const open = new MinHeap(); // priority queue on f=g+h
  open.push({ f: h(start), g: 0, node: start });
  const g = new Map([[key(start), 0]]);
  const parent = new Map([[key(start), null]]);
  while (!open.isEmpty) {
    const { g: cost, node } = open.pop();
    if (node === goal) return reconstructPath(parent, goal);
    for (const nb of getNeighbors(grid, node)) {
      const ng = cost + 1;
      if (ng < (g.get(key(nb)) ?? Infinity)) {
        g.set(key(nb), ng); parent.set(key(nb), node);
        open.push({ f: ng + h(nb), g: ng, node: nb });
      }
    }
  }
  return null;
}`,
      java: `List<int[]> aStar(int[][] grid, int[] start, int[] goal) {
  PriorityQueue<int[]> open = new PriorityQueue<>(Comparator.comparingInt(a -> a[0]));
  Map<String, Integer> g = new HashMap<>();
  Map<String, int[]> parent = new HashMap<>();
  open.add(new int[]{h(start,goal), 0, start[0], start[1]});
  g.put(key(start), 0); parent.put(key(start), null);
  while (!open.isEmpty()) {
    int[] cur = open.poll();
    int[] node = {cur[2], cur[3]};
    if (Arrays.equals(node, goal)) return buildPath(parent, goal);
    for (int[] nb : neighbors(grid, node)) {
      int ng = g.getOrDefault(key(node), Integer.MAX_VALUE) + 1;
      if (ng < g.getOrDefault(key(nb), Integer.MAX_VALUE)) {
        g.put(key(nb), ng); parent.put(key(nb), node);
        open.add(new int[]{ng + h(nb, goal), ng, nb[0], nb[1]});
      }
    }
  }
  return null;
}`,
      rust: `fn a_star(grid: &Vec<Vec<char>>, start: (usize,usize), goal: (usize,usize))
  -> Option<Vec<(usize,usize)>> {
  let h = |n: (usize,usize)| {
    (n.0 as i32 - goal.0 as i32).unsigned_abs() as usize +
    (n.1 as i32 - goal.1 as i32).unsigned_abs() as usize
  };
  let mut open = BinaryHeap::new(); // (Reverse(f), g, node)
  let mut g: HashMap<_,usize> = HashMap::new();
  let mut parent: HashMap<_,Option<_>> = HashMap::new();
  g.insert(start, 0); parent.insert(start, None);
  open.push(Reverse((h(start), 0usize, start)));
  while let Some(Reverse((_, cost, node))) = open.pop() {
    if node == goal { return Some(reconstruct(&parent, goal)); }
    for nb in neighbors(grid, node) {
      let ng = cost + 1;
      if ng < *g.get(&nb).unwrap_or(&usize::MAX) {
        g.insert(nb, ng); parent.insert(nb, Some(node));
        open.push(Reverse((ng + h(nb), ng, nb)));
      }
    }
  }
  None
}`,
      cpp: `vector<pair<int,int>> aStar(vector<vector<char>>& grid,
    pair<int,int> start, pair<int,int> goal) {
  auto h = [&](pair<int,int> n) {
    return abs(n.first-goal.first) + abs(n.second-goal.second);
  };
  priority_queue<tuple<int,int,pair<int,int>>,
    vector<tuple<int,int,pair<int,int>>>, greater<>> open;
  map<pair<int,int>, int> g;
  map<pair<int,int>, pair<int,int>> parent;
  g[start] = 0; parent[start] = {-1,-1};
  open.push({h(start), 0, start});
  while (!open.empty()) {
    auto [f, cost, node] = open.top(); open.pop();
    if (node == goal) return buildPath(parent, goal);
    for (auto& nb : neighbors(grid, node)) {
      int ng = cost + 1;
      if (!g.count(nb) || ng < g[nb]) {
        g[nb] = ng; parent[nb] = node;
        open.push({ng + h(nb), ng, nb});
      }
    }
  }
  return {};
}`,
    },
  },
]
