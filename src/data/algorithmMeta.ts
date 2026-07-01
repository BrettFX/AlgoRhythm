import type { AlgorithmMeta } from '@/types'
import { generateFrames as bubbleFrames } from '@/algorithms/bubbleSort'
import { generateFrames as selectionFrames } from '@/algorithms/selectionSort'
import { generateFrames as insertionFrames } from '@/algorithms/insertionSort'
import { generateFrames as mergeFrames } from '@/algorithms/mergeSort'
import { generateFrames as quickFrames } from '@/algorithms/quickSort'
import { generateFrames as heapFrames } from '@/algorithms/heapSort'
import { generateFrames as shellFrames } from '@/algorithms/shellSort'
import { generateFrames as radixFrames } from '@/algorithms/radixSort'

export const ALGORITHM_META: AlgorithmMeta[] = [
  {
    id: 'bubble-sort',
    name: 'Bubble Sort',
    description:
      'Repeatedly steps through the list, compares adjacent elements and swaps them if out of order. The largest unsorted element "bubbles" to its final position each pass. Simple to understand but inefficient on large lists. Best case O(n) when the array is already sorted (with early-exit optimization).',
    complexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
    generate: bubbleFrames,
    snippets: {
      python: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        swapped = False
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:
            break
    return arr`,
      javascript: `function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    if (!swapped) break;
  }
  return arr;
}`,
      java: `void bubbleSort(int[] arr) {
  int n = arr.length;
  for (int i = 0; i < n - 1; i++) {
    boolean swapped = false;
    for (int j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        int t = arr[j]; arr[j] = arr[j+1]; arr[j+1] = t;
        swapped = true;
      }
    }
    if (!swapped) break;
  }
}`,
      rust: `fn bubble_sort(arr: &mut Vec<i32>) {
  let n = arr.len();
  for i in 0..n - 1 {
    let mut swapped = false;
    for j in 0..n - i - 1 {
      if arr[j] > arr[j + 1] {
        arr.swap(j, j + 1);
        swapped = true;
      }
    }
    if !swapped { break; }
  }
}`,
      cpp: `void bubbleSort(vector<int>& arr) {
  int n = arr.size();
  for (int i = 0; i < n - 1; i++) {
    bool swapped = false;
    for (int j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        swap(arr[j], arr[j + 1]);
        swapped = true;
      }
    }
    if (!swapped) break;
  }
}`,
    },
  },
  {
    id: 'selection-sort',
    name: 'Selection Sort',
    description:
      'Divides the array into a sorted and an unsorted region. Each pass selects the minimum element from the unsorted region and places it at the end of the sorted region. Makes at most O(n) swaps — useful when write operations are costly. Performance is O(n²) regardless of input order.',
    complexity: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
    generate: selectionFrames,
    snippets: {
      python: `def selection_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr`,
      javascript: `function selectionSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) minIdx = j;
    }
    [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
  }
  return arr;
}`,
      java: `void selectionSort(int[] arr) {
  int n = arr.length;
  for (int i = 0; i < n - 1; i++) {
    int minIdx = i;
    for (int j = i + 1; j < n; j++)
      if (arr[j] < arr[minIdx]) minIdx = j;
    int t = arr[i]; arr[i] = arr[minIdx]; arr[minIdx] = t;
  }
}`,
      rust: `fn selection_sort(arr: &mut Vec<i32>) {
  let n = arr.len();
  for i in 0..n - 1 {
    let min_idx = (i..n)
      .min_by_key(|&k| arr[k])
      .unwrap();
    arr.swap(i, min_idx);
  }
}`,
      cpp: `void selectionSort(vector<int>& arr) {
  int n = arr.size();
  for (int i = 0; i < n - 1; i++) {
    int minIdx = i;
    for (int j = i + 1; j < n; j++)
      if (arr[j] < arr[minIdx]) minIdx = j;
    swap(arr[i], arr[minIdx]);
  }
}`,
    },
  },
  {
    id: 'insertion-sort',
    name: 'Insertion Sort',
    description:
      'Builds a sorted array one element at a time by inserting each new element into its correct position among the previously sorted elements. Very efficient on small or nearly-sorted arrays. It is the algorithm used internally by many standard library sorts for small subarrays.',
    complexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
    generate: insertionFrames,
    snippets: {
      python: `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr`,
      javascript: `function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return arr;
}`,
      java: `void insertionSort(int[] arr) {
  for (int i = 1; i < arr.length; i++) {
    int key = arr[i], j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
}`,
      rust: `fn insertion_sort(arr: &mut Vec<i32>) {
  for i in 1..arr.len() {
    let key = arr[i];
    let mut j = i;
    while j > 0 && arr[j - 1] > key {
      arr[j] = arr[j - 1];
      j -= 1;
    }
    arr[j] = key;
  }
}`,
      cpp: `void insertionSort(vector<int>& arr) {
  for (int i = 1; i < arr.size(); i++) {
    int key = arr[i], j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
}`,
    },
  },
  {
    id: 'merge-sort',
    name: 'Merge Sort',
    description:
      'A divide-and-conquer algorithm that recursively splits the array in half, sorts each half, then merges the sorted halves back together. Guarantees O(n log n) in all cases. Requires O(n) extra space for the merge step. Preferred when stable sorting and predictable performance are needed.',
    complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)' },
    generate: mergeFrames,
    snippets: {
      python: `def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

def merge(left, right):
    result, i, j = [], 0, 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i]); i += 1
        else:
            result.append(right[j]); j += 1
    return result + left[i:] + right[j:]`,
      javascript: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = arr.length >> 1;
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}
function merge(l, r) {
  const res = [];
  let i = 0, j = 0;
  while (i < l.length && j < r.length)
    res.push(l[i] <= r[j] ? l[i++] : r[j++]);
  return [...res, ...l.slice(i), ...r.slice(j)];
}`,
      java: `int[] mergeSort(int[] arr) {
  if (arr.length <= 1) return arr;
  int mid = arr.length / 2;
  int[] l = mergeSort(Arrays.copyOfRange(arr, 0, mid));
  int[] r = mergeSort(Arrays.copyOfRange(arr, mid, arr.length));
  return merge(l, r);
}
int[] merge(int[] l, int[] r) {
  int[] res = new int[l.length + r.length];
  int i = 0, j = 0, k = 0;
  while (i < l.length && j < r.length)
    res[k++] = l[i] <= r[j] ? l[i++] : r[j++];
  while (i < l.length) res[k++] = l[i++];
  while (j < r.length) res[k++] = r[j++];
  return res;
}`,
      rust: `fn merge_sort(arr: &[i32]) -> Vec<i32> {
  if arr.len() <= 1 { return arr.to_vec(); }
  let mid = arr.len() / 2;
  let left = merge_sort(&arr[..mid]);
  let right = merge_sort(&arr[mid..]);
  merge(&left, &right)
}
fn merge(l: &[i32], r: &[i32]) -> Vec<i32> {
  let (mut i, mut j) = (0, 0);
  let mut res = Vec::with_capacity(l.len() + r.len());
  while i < l.len() && j < r.len() {
    if l[i] <= r[j] { res.push(l[i]); i += 1; }
    else { res.push(r[j]); j += 1; }
  }
  res.extend_from_slice(&l[i..]);
  res.extend_from_slice(&r[j..]);
  res
}`,
      cpp: `vector<int> mergeSort(vector<int> arr) {
  if (arr.size() <= 1) return arr;
  int mid = arr.size() / 2;
  auto l = mergeSort({arr.begin(), arr.begin() + mid});
  auto r = mergeSort({arr.begin() + mid, arr.end()});
  vector<int> res;
  merge(l.begin(), l.end(), r.begin(), r.end(), back_inserter(res));
  return res;
}`,
    },
  },
  {
    id: 'quick-sort',
    name: 'Quick Sort',
    description:
      'Picks a pivot element and partitions the array so elements smaller than the pivot go left and larger go right, then recurses on each partition. Average case is O(n log n) and is often the fastest in practice due to cache efficiency. Worst case O(n²) occurs on already-sorted input with a naive pivot choice.',
    complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)', space: 'O(log n)' },
    generate: quickFrames,
    snippets: {
      python: `def quick_sort(arr, lo=0, hi=None):
    if hi is None: hi = len(arr) - 1
    if lo < hi:
        p = partition(arr, lo, hi)
        quick_sort(arr, lo, p - 1)
        quick_sort(arr, p + 1, hi)

def partition(arr, lo, hi):
    pivot = arr[hi]
    i = lo - 1
    for j in range(lo, hi):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i+1], arr[hi] = arr[hi], arr[i+1]
    return i + 1`,
      javascript: `function quickSort(arr, lo = 0, hi = arr.length - 1) {
  if (lo < hi) {
    const p = partition(arr, lo, hi);
    quickSort(arr, lo, p - 1);
    quickSort(arr, p + 1, hi);
  }
}
function partition(arr, lo, hi) {
  const pivot = arr[hi];
  let i = lo - 1;
  for (let j = lo; j < hi; j++)
    if (arr[j] <= pivot) { i++; [arr[i], arr[j]] = [arr[j], arr[i]]; }
  [arr[i+1], arr[hi]] = [arr[hi], arr[i+1]];
  return i + 1;
}`,
      java: `void quickSort(int[] arr, int lo, int hi) {
  if (lo < hi) {
    int p = partition(arr, lo, hi);
    quickSort(arr, lo, p - 1);
    quickSort(arr, p + 1, hi);
  }
}
int partition(int[] arr, int lo, int hi) {
  int pivot = arr[hi], i = lo - 1;
  for (int j = lo; j < hi; j++)
    if (arr[j] <= pivot) { int t=arr[++i]; arr[i]=arr[j]; arr[j]=t; }
  int t = arr[i+1]; arr[i+1] = arr[hi]; arr[hi] = t;
  return i + 1;
}`,
      rust: `fn quick_sort(arr: &mut [i32]) {
  if arr.len() <= 1 { return; }
  let p = partition(arr);
  quick_sort(&mut arr[..p]);
  quick_sort(&mut arr[p + 1..]);
}
fn partition(arr: &mut [i32]) -> usize {
  let hi = arr.len() - 1;
  let pivot = arr[hi];
  let mut i = 0;
  for j in 0..hi {
    if arr[j] <= pivot { arr.swap(i, j); i += 1; }
  }
  arr.swap(i, hi);
  i
}`,
      cpp: `void quickSort(vector<int>& arr, int lo, int hi) {
  if (lo < hi) {
    int p = partition(arr, lo, hi);
    quickSort(arr, lo, p - 1);
    quickSort(arr, p + 1, hi);
  }
}
int partition(vector<int>& arr, int lo, int hi) {
  int pivot = arr[hi], i = lo - 1;
  for (int j = lo; j < hi; j++)
    if (arr[j] <= pivot) swap(arr[++i], arr[j]);
  swap(arr[i+1], arr[hi]);
  return i + 1;
}`,
    },
  },
  {
    id: 'heap-sort',
    name: 'Heap Sort',
    description:
      'Converts the array into a max-heap, then repeatedly extracts the maximum element and places it at the end. Guaranteed O(n log n) in all cases with O(1) space. Less cache-friendly than quick sort in practice, but useful when a worst-case guarantee is required without extra memory.',
    complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(1)' },
    generate: heapFrames,
    snippets: {
      python: `def heap_sort(arr):
    n = len(arr)
    for i in range(n // 2 - 1, -1, -1):
        heapify(arr, n, i)
    for i in range(n - 1, 0, -1):
        arr[0], arr[i] = arr[i], arr[0]
        heapify(arr, i, 0)

def heapify(arr, n, i):
    largest, l, r = i, 2*i+1, 2*i+2
    if l < n and arr[l] > arr[largest]: largest = l
    if r < n and arr[r] > arr[largest]: largest = r
    if largest != i:
        arr[i], arr[largest] = arr[largest], arr[i]
        heapify(arr, n, largest)`,
      javascript: `function heapSort(arr) {
  const n = arr.length;
  for (let i = Math.floor(n/2) - 1; i >= 0; i--)
    heapify(arr, n, i);
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(arr, i, 0);
  }
}
function heapify(arr, n, i) {
  let max = i, l = 2*i+1, r = 2*i+2;
  if (l < n && arr[l] > arr[max]) max = l;
  if (r < n && arr[r] > arr[max]) max = r;
  if (max !== i) { [arr[i], arr[max]] = [arr[max], arr[i]]; heapify(arr, n, max); }
}`,
      java: `void heapSort(int[] arr) {
  int n = arr.length;
  for (int i = n/2 - 1; i >= 0; i--) heapify(arr, n, i);
  for (int i = n - 1; i > 0; i--) {
    int t = arr[0]; arr[0] = arr[i]; arr[i] = t;
    heapify(arr, i, 0);
  }
}
void heapify(int[] arr, int n, int i) {
  int max = i, l = 2*i+1, r = 2*i+2;
  if (l < n && arr[l] > arr[max]) max = l;
  if (r < n && arr[r] > arr[max]) max = r;
  if (max != i) { int t=arr[i]; arr[i]=arr[max]; arr[max]=t; heapify(arr,n,max); }
}`,
      rust: `fn heap_sort(arr: &mut Vec<i32>) {
  let n = arr.len();
  for i in (0..n/2).rev() { heapify(arr, n, i); }
  for i in (1..n).rev() {
    arr.swap(0, i);
    heapify(arr, i, 0);
  }
}
fn heapify(arr: &mut Vec<i32>, n: usize, mut i: usize) {
  loop {
    let (l, r) = (2*i+1, 2*i+2);
    let mut max = i;
    if l < n && arr[l] > arr[max] { max = l; }
    if r < n && arr[r] > arr[max] { max = r; }
    if max == i { break; }
    arr.swap(i, max); i = max;
  }
}`,
      cpp: `void heapSort(vector<int>& arr) {
  int n = arr.size();
  for (int i = n/2-1; i >= 0; i--) heapify(arr, n, i);
  for (int i = n-1; i > 0; i--) { swap(arr[0], arr[i]); heapify(arr, i, 0); }
}
void heapify(vector<int>& arr, int n, int i) {
  int max = i, l = 2*i+1, r = 2*i+2;
  if (l < n && arr[l] > arr[max]) max = l;
  if (r < n && arr[r] > arr[max]) max = r;
  if (max != i) { swap(arr[i], arr[max]); heapify(arr, n, max); }
}`,
    },
  },
  {
    id: 'shell-sort',
    name: 'Shell Sort',
    description:
      'An improvement over insertion sort that allows exchanging elements far apart. Uses a decreasing gap sequence (Knuth: 1, 4, 13, 40…) to perform gapped insertion sorts, making the array progressively more sorted before a final gap-1 pass. Efficient in practice with no additional memory.',
    complexity: { best: 'O(n log n)', average: 'O(n^1.5)', worst: 'O(n²)', space: 'O(1)' },
    generate: shellFrames,
    snippets: {
      python: `def shell_sort(arr):
    n, gap = len(arr), 1
    while gap < n // 3:
        gap = gap * 3 + 1  # Knuth sequence
    while gap >= 1:
        for i in range(gap, n):
            j = i
            while j >= gap and arr[j] < arr[j - gap]:
                arr[j], arr[j - gap] = arr[j - gap], arr[j]
                j -= gap
        gap //= 3
    return arr`,
      javascript: `function shellSort(arr) {
  const n = arr.length;
  let gap = 1;
  while (gap < Math.floor(n / 3)) gap = gap * 3 + 1;
  while (gap >= 1) {
    for (let i = gap; i < n; i++) {
      let j = i;
      while (j >= gap && arr[j] < arr[j - gap]) {
        [arr[j], arr[j - gap]] = [arr[j - gap], arr[j]];
        j -= gap;
      }
    }
    gap = Math.floor(gap / 3);
  }
  return arr;
}`,
      java: `void shellSort(int[] arr) {
  int n = arr.length, gap = 1;
  while (gap < n / 3) gap = gap * 3 + 1;
  while (gap >= 1) {
    for (int i = gap; i < n; i++) {
      int j = i;
      while (j >= gap && arr[j] < arr[j - gap]) {
        int t = arr[j]; arr[j] = arr[j-gap]; arr[j-gap] = t;
        j -= gap;
      }
    }
    gap /= 3;
  }
}`,
      rust: `fn shell_sort(arr: &mut Vec<i32>) {
  let n = arr.len();
  let mut gap = 1usize;
  while gap < n / 3 { gap = gap * 3 + 1; }
  while gap >= 1 {
    for i in gap..n {
      let mut j = i;
      while j >= gap && arr[j] < arr[j - gap] {
        arr.swap(j, j - gap);
        j -= gap;
      }
    }
    gap /= 3;
  }
}`,
      cpp: `void shellSort(vector<int>& arr) {
  int n = arr.size(), gap = 1;
  while (gap < n / 3) gap = gap * 3 + 1;
  while (gap >= 1) {
    for (int i = gap; i < n; i++) {
      int j = i;
      while (j >= gap && arr[j] < arr[j - gap]) {
        swap(arr[j], arr[j - gap]);
        j -= gap;
      }
    }
    gap /= 3;
  }
}`,
    },
  },
  {
    id: 'radix-sort',
    name: 'Radix Sort',
    description:
      'A non-comparative algorithm that sorts integers by processing individual digits from least to most significant. Distributes elements into 10 buckets per digit pass, then collects them in order. Achieves O(nk) where k is the number of digits. Ideal for large collections of integers with bounded values.',
    complexity: { best: 'O(nk)', average: 'O(nk)', worst: 'O(nk)', space: 'O(n+k)' },
    generate: radixFrames,
    snippets: {
      python: `def radix_sort(arr):
    max_val = max(arr)
    exp = 1
    while max_val // exp > 0:
        counting_sort(arr, exp)
        exp *= 10

def counting_sort(arr, exp):
    n = len(arr)
    output = [0] * n
    count = [0] * 10
    for i in arr:
        count[(i // exp) % 10] += 1
    for i in range(1, 10):
        count[i] += count[i - 1]
    for i in range(n - 1, -1, -1):
        d = (arr[i] // exp) % 10
        output[count[d] - 1] = arr[i]
        count[d] -= 1
    arr[:] = output`,
      javascript: `function radixSort(arr) {
  const max = Math.max(...arr);
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    countingSort(arr, exp);
  }
}
function countingSort(arr, exp) {
  const n = arr.length, out = new Array(n), count = new Array(10).fill(0);
  for (const v of arr) count[Math.floor(v / exp) % 10]++;
  for (let i = 1; i < 10; i++) count[i] += count[i - 1];
  for (let i = n - 1; i >= 0; i--) {
    const d = Math.floor(arr[i] / exp) % 10;
    out[--count[d]] = arr[i];
  }
  arr.splice(0, n, ...out);
}`,
      java: `void radixSort(int[] arr) {
  int max = Arrays.stream(arr).max().getAsInt();
  for (int exp = 1; max / exp > 0; exp *= 10)
    countingSort(arr, exp);
}
void countingSort(int[] arr, int exp) {
  int n = arr.length;
  int[] out = new int[n], count = new int[10];
  for (int v : arr) count[(v / exp) % 10]++;
  for (int i = 1; i < 10; i++) count[i] += count[i-1];
  for (int i = n-1; i >= 0; i--) {
    int d = (arr[i] / exp) % 10;
    out[--count[d]] = arr[i];
  }
  System.arraycopy(out, 0, arr, 0, n);
}`,
      rust: `fn radix_sort(arr: &mut Vec<i32>) {
  let max = *arr.iter().max().unwrap();
  let mut exp = 1i32;
  while max / exp > 0 {
    counting_sort(arr, exp);
    exp *= 10;
  }
}
fn counting_sort(arr: &mut Vec<i32>, exp: i32) {
  let n = arr.len();
  let mut out = vec![0i32; n];
  let mut count = [0usize; 10];
  for &v in arr.iter() { count[((v / exp) % 10) as usize] += 1; }
  for i in 1..10 { count[i] += count[i-1]; }
  for &v in arr.iter().rev() {
    let d = ((v / exp) % 10) as usize;
    count[d] -= 1; out[count[d]] = v;
  }
  *arr = out;
}`,
      cpp: `void radixSort(vector<int>& arr) {
  int maxVal = *max_element(arr.begin(), arr.end());
  for (int exp = 1; maxVal / exp > 0; exp *= 10)
    countingSort(arr, exp);
}
void countingSort(vector<int>& arr, int exp) {
  int n = arr.size();
  vector<int> out(n);
  int count[10] = {};
  for (int v : arr) count[(v / exp) % 10]++;
  for (int i = 1; i < 10; i++) count[i] += count[i-1];
  for (int i = n-1; i >= 0; i--) {
    int d = (arr[i] / exp) % 10;
    out[--count[d]] = arr[i];
  }
  arr = out;
}`,
    },
  },
]
