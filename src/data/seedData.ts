import { CollegeSubject, AcademicDocument, PredictedQuestion } from '../types';

export const SEED_SUBJECTS: CollegeSubject[] = [
  {
    id: 'dsa_3cs',
    code: '3CS4-05',
    name: 'Data Structures and Algorithms',
    shortName: 'DSA',
    department: 'CSE',
    semester: 3,
    units: [
      {
        unitNumber: 1,
        title: 'Introduction, Stacks & Queues',
        topics: [
          'Asymptotic notations (Big O, Omega, Theta)',
          'Stack operations and ADT',
          'Infix to Postfix conversion and Postfix evaluation',
          'Linear Queue and Circular Queue implementation',
          'Priority Queue and Double Ended Queue (Deque)'
        ],
        approxWeightageMarks: 16
      },
      {
        unitNumber: 2,
        title: 'Linked Lists & Applications',
        topics: [
          'Singly Linked List, Doubly Linked List, Circular Linked List',
          'Polynomial representation and addition using Linked Lists',
          'Sparse matrix representation',
          'Header linked lists and cursor-based linked lists'
        ],
        approxWeightageMarks: 16
      },
      {
        unitNumber: 3,
        title: 'Non-Linear Structures: Trees',
        topics: [
          'Binary Tree, Binary Search Tree (BST) operations',
          'Tree traversals (Inorder, Preorder, Postorder - Recursive & Non-Recursive)',
          'Threaded Binary Trees',
          'AVL Trees (Rotations: LL, RR, LR, RL)',
          'B-Trees and B+ Trees (m-way search trees), Red-Black Trees introduction'
        ],
        approxWeightageMarks: 20
      },
      {
        unitNumber: 4,
        title: 'Graphs & Algorithms',
        topics: [
          'Graph representation (Adjacency Matrix, Adjacency List)',
          'Graph traversal: Breadth First Search (BFS) and Depth First Search (DFS)',
          'Minimum Spanning Trees: Kruskal\'s and Prim\'s algorithms',
          'Shortest Path algorithms: Dijkstra\'s Algorithm, Floyd-Warshall Algorithm'
        ],
        approxWeightageMarks: 16
      },
      {
        unitNumber: 5,
        title: 'Searching, Sorting & Hashing',
        topics: [
          'Internal & External sorting',
          'Quick Sort, Merge Sort, Heap Sort (Building Max/Min Heap)',
          'Hashing techniques: Hash functions, Collision resolution (Linear Probing, Quadratic Probing, Double Hashing, Chaining)',
          'Rehashing and Load Factor'
        ],
        approxWeightageMarks: 16
      }
    ]
  },
  {
    id: 'os_4cs',
    code: '4CS4-05',
    name: 'Operating Systems',
    shortName: 'OS',
    department: 'CSE',
    semester: 4,
    units: [
      {
        unitNumber: 1,
        title: 'OS Introduction & System Structure',
        topics: [
          'OS Services, System Calls & System Programs',
          'Dual mode operation (User Mode & Kernel Mode)',
          'Monolithic, Layered, and Microkernel architectures'
        ],
        approxWeightageMarks: 14
      },
      {
        unitNumber: 2,
        title: 'Process Management & CPU Scheduling',
        topics: [
          'Process Control Block (PCB), Context Switching',
          'CPU Scheduling algorithms: FCFS, SJF, Priority, Round Robin (Gantt charts & numericals)',
          'Multithreading models (Many-to-One, One-to-One, Many-to-Many)'
        ],
        approxWeightageMarks: 18
      },
      {
        unitNumber: 3,
        title: 'Process Synchronization & Deadlocks',
        topics: [
          'Critical Section Problem, Peterson\'s Solution',
          'Semaphores and Mutex locks, Classic sync problems (Producer-Consumer, Dining Philosophers)',
          'Deadlock characterization (4 Coffman conditions)',
          'Deadlock Avoidance: Banker\'s Algorithm (Safety & Resource Request numericals)',
          'Deadlock Detection and Recovery'
        ],
        approxWeightageMarks: 20
      },
      {
        unitNumber: 4,
        title: 'Memory Management & Virtual Memory',
        topics: [
          'Contiguous allocation (First Fit, Best Fit, Worst Fit)',
          'Paging: Page Table, Translation Lookaside Buffer (TLB), Effective Access Time',
          'Segmentation',
          'Virtual Memory, Demand Paging, Page Faults',
          'Page Replacement Algorithms: FIFO, Optimal, LRU (Page fault numericals)'
        ],
        approxWeightageMarks: 20
      },
      {
        unitNumber: 5,
        title: 'File Systems & Disk Scheduling',
        topics: [
          'File allocation methods (Contiguous, Linked, Indexed)',
          'Free-space management (Bit vector, Linked list)',
          'Disk Scheduling algorithms: FCFS, SSTF, SCAN, C-SCAN, LOOK, C-LOOK'
        ],
        approxWeightageMarks: 12
      }
    ]
  },
  {
    id: 'dbms_5cs',
    code: '5CS4-03',
    name: 'Database Management Systems',
    shortName: 'DBMS',
    department: 'CSE',
    semester: 5,
    units: [
      {
        unitNumber: 1,
        title: 'Database System Architecture & ER Modeling',
        topics: ['3-Schema Architecture', 'Data Independence', 'ER Diagrams to Relational Tables mapping'],
        approxWeightageMarks: 16
      },
      {
        unitNumber: 2,
        title: 'Relational Model & Relational Algebra',
        topics: ['Integrity Constraints', 'Relational Algebra operations (Select, Project, Join, Division)', 'Tuple Relational Calculus'],
        approxWeightageMarks: 16
      },
      {
        unitNumber: 3,
        title: 'Relational Database Design & Normalization',
        topics: ['Functional Dependencies', '1NF, 2NF, 3NF, BCNF decomposition', 'Lossless join & Dependency preservation'],
        approxWeightageMarks: 20
      },
      {
        unitNumber: 4,
        title: 'Transaction Management & Concurrency Control',
        topics: ['ACID Properties', 'Serializability (Conflict & View)', 'Two-Phase Locking (2PL)', 'Deadlock Handling & Timestamp ordering'],
        approxWeightageMarks: 20
      },
      {
        unitNumber: 5,
        title: 'Query Processing & Indexing',
        topics: ['Query evaluation steps', 'Indexing: B-Tree and B+ Tree index structures', 'Hashing techniques in storage'],
        approxWeightageMarks: 14
      }
    ]
  },
  {
    id: 'dm_3cs',
    code: '3CS4-06',
    name: 'Discrete Mathematics',
    shortName: 'Discrete Math',
    department: 'CSE',
    semester: 3,
    units: [
      {
        unitNumber: 1,
        title: 'Set Theory, Relations & Functions',
        topics: ['Sets, Subsets, Power Sets, Venn Diagrams', 'Equivalence Relations, Partial Order Relations, Posets, Hasse Diagrams', 'Functions: Injective, Surjective, Bijective, Composition'],
        approxWeightageMarks: 16
      },
      {
        unitNumber: 2,
        title: 'Propositional Logic & Proofs',
        topics: ['Propositions, Connectives, Truth Tables, Tautology', 'Normal Forms (PDNF, PCNF)', 'Rules of Inference, Mathematical Induction'],
        approxWeightageMarks: 16
      },
      {
        unitNumber: 3,
        title: 'Recurrence Relations & Generating Functions',
        topics: ['Solving linear recurrence relations with constant coefficients (Homogeneous & Non-Homogeneous)', 'Generating functions', 'Pigeonhole Principle and applications'],
        approxWeightageMarks: 20
      },
      {
        unitNumber: 4,
        title: 'Lattices & Boolean Algebra',
        topics: ['Lattices as Posets, Complete, Distributive, Modular and Complemented Lattices', 'Boolean Algebra, Boolean functions, Karnaugh Maps (K-Maps)'],
        approxWeightageMarks: 16
      },
      {
        unitNumber: 5,
        title: 'Graph Theory & Trees',
        topics: ['Graphs, Subgraphs, Isomorphism, Paths, Circuits, Euler and Hamiltonian Paths', 'Graph Coloring, Chromatic number, Trees, Spanning Trees, Cut sets'],
        approxWeightageMarks: 16
      }
    ]
  },
  {
    id: 'oops_3cs',
    code: '3CS4-04',
    name: 'Object Oriented Programming with C++',
    shortName: 'OOPs (C++)',
    department: 'CSE',
    semester: 3,
    units: [
      {
        unitNumber: 1,
        title: 'OOP Concepts & Basics',
        topics: ['Encapsulation, Data Hiding, Abstraction, Polymorphism', 'Classes, Objects, Constructors (Default, Parameterized, Copy), Destructors', 'Friend functions and Friend classes'],
        approxWeightageMarks: 16
      },
      {
        unitNumber: 2,
        title: 'Operator Overloading & Type Conversion',
        topics: ['Unary and Binary operator overloading', 'Overloading << and >> operators', 'Data conversion (Basic to Class, Class to Basic, Class to Class)'],
        approxWeightageMarks: 16
      },
      {
        unitNumber: 3,
        title: 'Inheritance & Virtual Functions',
        topics: ['Single, Multilevel, Multiple, Hierarchical, Hybrid inheritance', 'Virtual base classes, Abstract classes, Pure virtual functions, Runtime polymorphism', 'VTABLE and VPTR mechanisms'],
        approxWeightageMarks: 20
      },
      {
        unitNumber: 4,
        title: 'Templates & Exception Handling',
        topics: ['Function templates and Class templates', 'Exception handling: try, catch, throw, rethrowing', 'Standard Template Library (STL): Vectors, Lists, Maps'],
        approxWeightageMarks: 16
      },
      {
        unitNumber: 5,
        title: 'Streams, Files & String Handling',
        topics: ['C++ Stream classes hierarchy, File pointers and manipulators', 'Sequential and Random file access (seekg, seekp, tellg, tellp)', 'Command-line arguments'],
        approxWeightageMarks: 16
      }
    ]
  }
];

export const SEED_DOCUMENTS: AcademicDocument[] = [
  // SYLLABUS DOCS
  {
    id: 'syl_dsa',
    title: 'SKIT RTU Syllabus - Data Structures & Algorithms (3CS4-05)',
    subjectId: 'dsa_3cs',
    category: 'syllabus',
    semester: 3,
    department: 'CSE',
    tags: ['RTU Kota', 'Syllabus', 'Scheme 2024-25', 'Course Outcomes'],
    createdAt: '2026-08-01',
    content: `# Rajasthan Technical University, Kota & SKIT Jaipur
## Course: 3CS4-05: Data Structures and Algorithms
**Credits: 3 | L: 3, T: 0, P: 0 | Max Marks: 100 (Internal: 30, End-Term RTU: 70)**

### Course Outcomes (COs):
- **CO1**: Understand and analyze time and space complexity of algorithms using asymptotic notations.
- **CO2**: Implement linear data structures (Stacks, Queues, Linked Lists) and their practical applications.
- **CO3**: Design and traverse non-linear structures (Binary Trees, BST, AVL Trees, B-Trees).
- **CO4**: Implement graph traversal, shortest path, and minimum spanning tree algorithms.
- **CO5**: Evaluate searching, sorting techniques, and collision resolution in hashing.

### RTU Examination Question Paper Pattern:
- **Part A**: 10 questions of 2 marks each = 20 Marks (2 questions from each unit; brief & conceptual).
- **Part B**: 5 questions to be answered out of 7 questions of 4 marks each = 20 Marks (Analytical / Derivations / Small code).
- **Part C**: 3 questions to be answered out of 5 questions of 10 marks each = 30 Marks (Comprehensive problem solving, algorithm design, complete trace).
- **Total**: 70 Marks, Duration: 3 Hours.`
  },

  // TEACHER'S NOTES - DSA
  {
    id: 'notes_dsa_u3_avl',
    title: 'Prof. Sharma Class Notes: Unit 3 - AVL Trees & Rotations Complete Guide',
    subjectId: 'dsa_3cs',
    category: 'notes',
    semester: 3,
    department: 'CSE',
    unit: 3,
    teacherName: 'Prof. Naveen Sharma (SKIT CSE Dept)',
    tags: ['Class Notes', 'Unit 3', 'AVL Rotations', 'Important for RTU Exam'],
    createdAt: '2026-09-14',
    content: `# SKIT CSE Dept - Prof. Naveen Sharma Class Notes
## Unit 3: Height Balanced Trees (AVL Trees)

### 1. Definition & Balance Factor
An **AVL Tree** is a self-balancing Binary Search Tree (BST) where the difference between heights of left and right subtrees cannot be more than 1 for all nodes.

$$\\text{Balance Factor (BF)} = \\text{Height}(LeftSubtree) - \\text{Height}(RightSubtree)$$

For a valid AVL Tree, for every node $x$:
$$\\text{BF}(x) \\in \\{-1, 0, +1\\}$$
If $\\text{BF}(x) > 1$ or $\\text{BF}(x) < -1$, the node is **unbalanced** and requires restructuring via tree rotations.

### 2. Four Rebalancing Rotations (Crucial for 10-Mark RTU Question!)
*Teacher Note for RTU Exams: Always write the condition, draw the generic node diagram, and show before-and-after tree state.*

#### (A) LL Rotation (Single Right Rotation)
- **Condition**: New node inserted into the **Left** subtree of the **Left** child of unbalanced node $A$.
- **Trigger**: $\\text{BF}(A) = +2$ and $\\text{BF}(\\text{LeftChild}) = +1$.
- **Action**: Rotate node $A$ to the right around its left child $B$.
- **Result**: $B$ becomes the new root; $A$ becomes right child of $B$; $B$'s original right subtree becomes left subtree of $A$.

#### (B) RR Rotation (Single Left Rotation)
- **Condition**: New node inserted into the **Right** subtree of the **Right** child of unbalanced node $A$.
- **Trigger**: $\\text{BF}(A) = -2$ and $\\text{BF}(\\text{RightChild}) = -1$.
- **Action**: Rotate node $A$ to the left around its right child $B$.
- **Result**: $B$ becomes root; $A$ becomes left child of $B$.

#### (C) LR Rotation (Double Rotation: Left then Right)
- **Condition**: Insertion into **Right** subtree of **Left** child of $A$.
- **Trigger**: $\\text{BF}(A) = +2$ and $\\text{BF}(B) = -1$ (where $B$ is left child of $A$).
- **Action**: First Left-Rotate at $B$, then Right-Rotate at $A$.

#### (D) RL Rotation (Double Rotation: Right then Left)
- **Condition**: Insertion into **Left** subtree of **Right** child of $A$.
- **Trigger**: $\\text{BF}(A) = -2$ and $\\text{BF}(B) = +1$ (where $B$ is right child of $A$).
- **Action**: First Right-Rotate at $B$, then Left-Rotate at $A$.

### 3. Time Complexity
- Search: $O(\\log n)$
- Insertion: $O(\\log n)$ (at most 2 rotations needed)
- Deletion: $O(\\log n)$ (may require up to $O(\\log n)$ rotations up to root)
- Space: $O(n)$

### 4. Class Solved Example (Repeated in SKIT Mid-Term 1)
Insert keys: $10, 20, 30, 40, 50, 25$ into an initially empty AVL Tree.
1. Insert 10: BF(10)=0.
2. Insert 20: 10->right=20. BF(10)=-1, BF(20)=0.
3. Insert 30: 10->20->30. BF(10)=-2, BF(20)=-1. **RR imbalance at 10**.
   - Perform Left Rotation at 10: 20 becomes root, 10 is left child, 30 is right child.
4. Insert 40: 30->right=40. BF(20)=-1, BF(30)=-1. Balanced.
5. Insert 50: 30->40->50. BF(30)=-2, BF(40)=-1. **RR imbalance at 30**.
   - Left rotate at 30: 40 becomes child of 20; 30 left of 40, 50 right of 40.
6. Insert 25: 10->right=25. BF(20)=+1, BF(10)=-1. **RL or LR balancing as per tree trace**.`
  },

  {
    id: 'notes_dsa_u1_stack',
    title: 'Prof. Sharma Class Notes: Unit 1 - Infix to Postfix Algorithm & Stack Trace',
    subjectId: 'dsa_3cs',
    category: 'notes',
    semester: 3,
    department: 'CSE',
    unit: 1,
    teacherName: 'Prof. Naveen Sharma (SKIT CSE Dept)',
    tags: ['Class Notes', 'Unit 1', 'Stack Applications', 'RTU 2023 Solved'],
    createdAt: '2026-08-20',
    content: `# SKIT CSE Dept - Prof. Naveen Sharma Notes
## Unit 1: Stack Applications - Infix to Postfix Conversion

### Teacher's Golden Rule for RTU Step-Marking:
In RTU exams, never write just the final postfix string! The examiner checks the 4-column trace table:
| Symbol Scanned | Stack Content | Postfix Expression (Output) | Action/Reason |

### Precedence Table:
1. Parenthesis '(', ')' - highest priority during expression scan, but lowest in stack.
2. Power '^', '$' - Right to Left associativity (Precedence: 3)
3. Multiplication '*', Division '/' - Left to Right (Precedence: 2)
4. Addition '+', Subtraction '-' - Left to Right (Precedence: 1)

### Standard Algorithm (Shunting-Yard by Edsger Dijkstra):
1. Initialize an empty stack and an empty output string.
2. Scan the infix expression from left to right:
   - If operand (letter/number), append directly to output.
   - If '(', push onto stack.
   - If ')', pop from stack and append to output until '(' is encountered. Discard '('.
   - If operator: While stack is non-empty and precedence of top of stack $\\ge$ precedence of incoming operator (taking associativity into account), pop top to output. Then push incoming operator onto stack.
3. Pop any remaining operators in stack and append to output.`
  },

  // ASSIGNMENTS - PRESENT YEAR
  {
    id: 'assign_dsa_2024_1',
    title: 'SKIT Odd Semester 2024-25: Assignment 1 (Data Structures)',
    subjectId: 'dsa_3cs',
    category: 'assignment',
    semester: 3,
    department: 'CSE',
    unit: 1,
    teacherName: 'Prof. Naveen Sharma',
    tags: ['Present Year', 'Assignment 1', 'Stacks', 'Queues', 'Due Oct 2024'],
    createdAt: '2026-09-05',
    assignmentDetails: {
      deadline: '2026-10-30',
      totalMarks: 20,
      submissionFormat: 'Handwritten / A4 sheets in SKIT Department Folder with student roll number'
    },
    content: `## SKIT Jaipur - Department of Computer Science & Engineering
### Subject: Data Structures & Algorithms (3CS4-05) - Assignment Sheet 1
**Faculty: Prof. Naveen Sharma | Total Marks: 20 | Submission Deadline: 30th October**

#### Instructions:
1. Solution must follow classroom format: Problem Statement, Formula/Algorithm, Tabular Trace, and Complexity Analysis.
2. Diagrammatic representations are mandatory where applicable.

#### Questions:
- **Q1 [5 Marks]**: Convert the following infix expression to postfix using stack trace table:
  \`(A + B * C) / (D - E ^ F) * G\`
  Show the step-by-step state of the stack at each scanned character.
- **Q2 [5 Marks]**: What is the limitation of a Linear Queue? Explain how a Circular Queue overcomes it. Write C/C++ functions for:
  a) \`enqueue(element)\`
  b) \`dequeue()\`
  with boundary condition checks for Queue Full and Queue Empty.
- **Q3 [5 Marks]**: Evaluate the following postfix expression showing operand stack trace at every step:
  \`6 2 3 + - 3 8 2 / + * 2 ^ 3 +\`
- **Q4 [5 Marks]**: Write an algorithm to reverse a Singly Linked List in $O(n)$ time using $O(1)$ auxiliary space (by pointer manipulation, without copying data).`
  },

  {
    id: 'assign_os_2024_2',
    title: 'SKIT Even Semester 2024-25: Assignment 2 (Operating Systems)',
    subjectId: 'os_4cs',
    category: 'assignment',
    semester: 4,
    department: 'CSE',
    unit: 3,
    teacherName: 'Dr. Meenakshi S.',
    tags: ['Present Year', 'Assignment 2', 'Banker Algorithm', 'Page Replacement'],
    createdAt: '2026-10-01',
    assignmentDetails: {
      deadline: '2026-11-15',
      totalMarks: 20,
      submissionFormat: 'Department format with cover page and Gantt/allocation matrices'
    },
    content: `## SKIT Jaipur - Department of Computer Science & Engineering
### Subject: Operating Systems (4CS4-05) - Assignment Sheet 2
**Faculty: Dr. Meenakshi S. | Total Marks: 20**

#### Questions:
- **Q1 [10 Marks]**: Consider a system with 5 processes ($P_0, P_1, P_2, P_3, P_4$) and 3 resource types ($A, B, C$).
  Resource instances: $A = 10, B = 5, C = 7$.
  At time $T_0$, the snapshot is:
  - **Allocation**: $P_0(0,1,0), P_1(2,0,0), P_2(3,0,2), P_3(2,1,1), P_4(0,0,2)$
  - **Max**: $P_0(7,5,3), P_1(3,2,2), P_2(9,0,2), P_3(2,2,2), P_4(4,3,3)$
  - **Available**: $(3, 3, 2)$

  Tasks:
  1. Calculate the **Need Matrix** (Formula: $\\text{Need} = \\text{Max} - \\text{Allocation}$).
  2. Is the system in a safe state? If yes, find the Safe Sequence using Banker's Algorithm safety test.
  3. If process $P_1$ arrives with request $(1, 0, 2)$, can the request be granted immediately? Justify.

- **Q2 [10 Marks]**: A virtual memory system has 3 page frames. Given the reference string:
  \`7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1\`
  Calculate the number of page faults and page hit ratio using:
  a) FIFO (First In First Out)
  b) LRU (Least Recently Used)
  c) Optimal Page Replacement
  Compare the efficiency of the three algorithms.`
  },

  // PAST YEAR QUESTIONS (PYQs) - SKIT & RTU
  {
    id: 'pyq_rtu_dsa_2023',
    title: 'RTU Kota End-Term Examination 2023 - Data Structures & Algorithms',
    subjectId: 'dsa_3cs',
    category: 'pyq',
    semester: 3,
    department: 'CSE',
    year: '2023',
    examType: 'RTU_MAIN',
    tags: ['RTU Main Paper', 'Dec 2023', 'End Term', 'All Units'],
    createdAt: '2023-12-28',
    content: `# Rajasthan Technical University, Kota
## B.Tech III Semester (CS & IT) Examination, Dec 2023
### Course Code: 3CS4-05: Data Structures and Algorithms
**Time: 3 Hours | Max Marks: 70**

### PART A (Short Answer Questions - 10 x 2 = 20 Marks):
1. Define Big-O and Big-Omega notations with mathematical definitions.
2. What is a Deque? Mention its two variations (Input-restricted and Output-restricted).
3. State the advantage of Circular Linked List over Linear Linked List.
4. Define threaded binary tree. Why is it used?
5. What is the Balance Factor of an AVL tree? What are its valid values?
6. Differentiate between B-Tree and B+ Tree in two points.
7. Explain the principle of Greedy technique in Kruskal's algorithm.
8. Define collision in hashing. What is load factor?
9. Show the best-case and worst-case time complexity of Quick Sort.
10. How does polynomial addition work using linked lists?

### PART B (Analytical Questions - Attempt any 5 out of 7 - 5 x 4 = 20 Marks):
1. Explain the evaluation of postfix expression using stack with a suitable example.
2. Write C function to delete a node with a given key from a Doubly Linked List.
3. Construct an AVL tree by inserting the following sequence: 21, 26, 30, 9, 4, 14, 28, 18.
4. Explain BFS algorithm with pseudo-code and find the traversal for a given 6-vertex graph.
5. Explain Open Addressing collision resolution methods (Linear Probing vs Quadratic Probing).
6. Write algorithm for Heap Sort and build a Max Heap for: 45, 12, 85, 32, 89, 39, 69.
7. Differentiate between Depth First Search (DFS) and Breadth First Search (BFS) in terms of space and data structures used.

### PART C (Comprehensive - Attempt any 3 out of 5 - 3 x 10 = 30 Marks):
1. (a) Discuss Dijkstra's algorithm for finding single source shortest paths.
   (b) Apply Dijkstra's algorithm on the given weighted graph with vertices {A, B, C, D, E} and find shortest path from source A.
2. (a) What are B-Trees? State the properties of a B-Tree of order $m$.
   (b) Construct a B-tree of order 4 for the keys: 5, 3, 21, 9, 1, 13, 2, 7, 10, 12, 4, 8.
3. Compare Quick Sort and Merge Sort. Derive the recurrence relations and solve them using Master Theorem for average and worst cases.
4. Explain Prim's algorithm for Minimum Spanning Tree. Prove why Prim's algorithm guarantees an optimal spanning tree.`
  },

  {
    id: 'pyq_skit_dsa_mt1_2024',
    title: 'SKIT Mid-Term 1 (MT-1) Examination 2024 - Data Structures',
    subjectId: 'dsa_3cs',
    category: 'pyq',
    semester: 3,
    department: 'CSE',
    year: '2024',
    examType: 'SKIT_MT1',
    tags: ['SKIT Internal', 'MT-1', 'Units 1 and 2', 'Sept 2024'],
    createdAt: '2026-09-22',
    content: `# Swami Keshvanand Institute of Technology (SKIT), Jaipur
## First Mid-Term Examination (MT-1) - Sept 2024
### Subject: Data Structures (3CS4-05) | Max Marks: 30 | Time: 1.5 Hours

### PART A (2 x 3 = 6 Marks):
1. Show why array implementation of stack requires bound checking.
2. Convert infix \`A * B + C / D\` to postfix without using table.
3. What is a sentinel node in linked lists?

### PART B (4 x 3 = 12 Marks):
1. Write a complete C function for Circular Queue \`insert()\` and \`delete()\` operations.
2. Convert the expression \`A + (B * C - (D / E ^ F) * G) * H\` into postfix notation showing complete stack status table.
3. Explain polynomial representation using linked list. Write pseudo code to add two polynomials.

### PART C (12 Marks - Attempt any 1):
1. (a) Implement Doubly Linked List with operations: insert at beginning, delete from end, search a key.
   (b) Contrast Array vs Linked List memory allocation and time complexity.`
  },

  {
    id: 'pyq_rtu_os_2023',
    title: 'RTU Kota End-Term Examination 2023 - Operating Systems',
    subjectId: 'os_4cs',
    category: 'pyq',
    semester: 4,
    department: 'CSE',
    year: '2023',
    examType: 'RTU_MAIN',
    tags: ['RTU Main Paper', 'Operating Systems', 'End Term', 'Dec 2023'],
    createdAt: '2023-12-15',
    content: `# Rajasthan Technical University, Kota
## B.Tech IV Semester Examination - Operating Systems (4CS4-05)
**Max Marks: 70 | Time: 3 Hours**

### PART A (10 x 2 = 20 Marks):
1. What is the difference between system call and system program?
2. What are the states in a 5-state process model?
3. Define turnaround time and waiting time.
4. What is starvation? How is aging used to prevent it?
5. Name the four necessary conditions for deadlock.
6. What is a Translation Lookaside Buffer (TLB)?
7. What is Belady's Anomaly? Name the algorithm that suffers from it.
8. Differentiate between internal and external fragmentation.
9. What is thrashing in operating systems?
10. Define seek time and rotational latency in hard disks.

### PART B (5 x 4 = 20 Marks):
1. Explain the process state transition diagram with neat sketch.
2. Given processes with arrival times and burst times, draw Gantt chart and compute average waiting time using Preemptive SJF (SRTF).
3. Explain Peterson's solution for critical section problem and verify its 3 requirements.
4. Solve Banker's algorithm safe sequence problem for a 4-process, 3-resource system.
5. Contrast Paging and Segmentation with respect to memory overhead and programmer visibility.

### PART C (3 x 10 = 30 Marks):
1. Detailed study of Banker's Algorithm: Safety Algorithm and Resource-Request Algorithm with full numerical example.
2. Virtual Memory: Explain Demand Paging, page fault handling routine, and compare FIFO, LRU, Optimal for given 20-page reference string.
3. Disk scheduling algorithms: FCFS, SSTF, SCAN, LOOK. Calculate total head movements for 8-cylinder request queue.`
  },

  // DISCRETE MATHEMATICS DOCS
  {
    id: 'notes_dm_u3_recurrence',
    title: 'Prof. Agarwal Notes: Unit 3 - Solving Linear Recurrence Relations & Pigeonhole',
    subjectId: 'dm_3cs',
    category: 'notes',
    semester: 3,
    department: 'CSE',
    unit: 3,
    teacherName: 'Prof. R. K. Agarwal (SKIT Maths Dept)',
    tags: ['Discrete Math', 'Unit 3', 'Recurrence Relations', 'RTU 10-Mark Question'],
    createdAt: '2026-09-18',
    content: `# SKIT Mathematics Dept - Discrete Mathematics
## Unit 3: Second-Order Homogeneous & Non-Homogeneous Recurrence Relations

### Characteristic Equation Method (Homogeneous: $a_n + c_1 a_{n-1} + c_2 a_{n-2} = 0$)
1. Substitute $a_n = r^n$.
2. Form the characteristic quadratic equation:
   $$r^2 + c_1 r + c_2 = 0$$
3. Cases for roots $r_1, r_2$:
   - **Case 1 (Distinct Real Roots $r_1 \\ne r_2$)**:
     $$a_n = C_1 (r_1)^n + C_2 (r_2)^n$$
   - **Case 2 (Equal Roots $r_1 = r_2 = r$)**:
     $$a_n = (C_1 + C_2 n) r^n$$
   - **Case 3 (Complex Conjugate Roots $\\alpha \\pm i\\beta$)**:
     $$a_n = R^n (C_1 \\cos n\\theta + C_2 \\sin n\\theta)$$

### RTU Solved Numerical:
Solve: $a_n - 7a_{n-1} + 10a_{n-2} = 0$ with $a_0 = 1, a_1 = 8$.
- Characteristic eq: $r^2 - 7r + 10 = 0 \\implies (r - 2)(r - 5) = 0$. Roots: $r_1 = 2, r_2 = 5$.
- General solution: $a_n = C_1 (2)^n + C_2 (5)^n$.
- Initial conditions:
  $n=0 \\implies C_1 + C_2 = 1$
  $n=1 \\implies 2C_1 + 5C_2 = 8$
- Solving yields: $3C_2 = 6 \\implies C_2 = 2, C_1 = -1$.
- Final Solution: $a_n = -1(2)^n + 2(5)^n$.`
  },
  {
    id: 'pyq_rtu_dm_2023',
    title: 'RTU Kota End-Term Examination 2023 - Discrete Mathematics (3CS4-06)',
    subjectId: 'dm_3cs',
    category: 'pyq',
    semester: 3,
    department: 'CSE',
    year: '2023',
    examType: 'RTU_MAIN',
    tags: ['RTU Main Paper', 'Discrete Math', 'Dec 2023'],
    createdAt: '2023-12-22',
    content: `# Rajasthan Technical University, Kota
## B.Tech III Semester Examination - Discrete Mathematics (3CS4-06)

### PART A (2 Marks each):
1. State Pigeonhole Principle and Extended Pigeonhole Principle.
2. Define partial order relation and give an example.
3. Draw Hasse diagram for the divisibility relation on set $D_{12} = \\{1, 2, 3, 4, 6, 12\\}$.
4. What is a complete graph $K_n$? How many edges does it contain?
5. State the necessary condition for an Eulerian path in a connected graph.

### PART B (4 Marks each):
1. Prove by Mathematical Induction that $1 + 2 + 3 + \\dots + n = \\frac{n(n+1)}{2}$.
2. Obtain the Principal Disjunctive Normal Form (PDNF) for $(P \\land Q) \\lor (\\neg P \\land R)$.
3. Solve the recurrence relation $a_n - 6a_{n-1} + 9a_{n-2} = 0$ with $a_0 = 1, a_1 = 6$.

### PART C (10 Marks each):
1. (a) State and prove Handshaking Lemma for graphs.
   (b) Show that every planar graph can be colored with 5 colors (Five Color Theorem).
2. Solve the non-homogeneous recurrence relation: $a_n - 4a_{n-1} + 4a_{n-2} = 3^n + 2^n$.`
  }
];

export const SEED_PREDICTIONS: PredictedQuestion[] = [
  {
    id: 'pred_dsa_1',
    subjectId: 'dsa_3cs',
    unit: 3,
    part: 'PART_C',
    questionText: 'Explain AVL Tree rebalancing rotations (LL, RR, LR, RL) with diagrams. Insert keys {15, 20, 24, 10, 13, 7, 30, 36, 25} into an empty AVL tree and show balance factor at each step.',
    expectedMarks: 10,
    probability: 95,
    trendReason: 'Repeated in RTU Main 2021, 2022, 2023; highlighted heavily in Prof. Naveen Sharma notes and Assignment 1; Unit 3 core question.',
    modelAnswerPoints: [
      'Define AVL Tree and Balance Factor formula: BF = height(L) - height(R)',
      'Explain LL and RR single rotations with general tree diagrams',
      'Explain LR and RL double rotations with intermediate steps',
      'Step-by-step trace of the 9 keys showing tree shape and BF after each insertion',
      'State time complexity: O(log n) search, insert, and delete'
    ],
    sourcePYQYears: ['RTU 2021', 'RTU 2022', 'RTU 2023', 'SKIT MT-2 2024'],
    teacherEmphasisNote: 'Prof. Sharma notes emphasize drawing balance factors beside each node for full 10/10 marks.'
  },
  {
    id: 'pred_dsa_2',
    subjectId: 'dsa_3cs',
    unit: 1,
    part: 'PART_B',
    questionText: 'Convert the following infix expression into postfix using Stack trace table: (A + B * C) / (D - E ^ F) * G. Clearly show Symbol Scanned, Stack Content, and Output Expression.',
    expectedMarks: 4,
    probability: 92,
    trendReason: 'Standard RTU Part B numerical question appearing every single year since 2019; identical format in current year Assignment 1 Q1.',
    modelAnswerPoints: [
      'Write operator precedence and associativity rules (Parentheses > Power R-to-L > Mul/Div L-to-R > Add/Sub L-to-R)',
      'Construct a 4-column trace table with every token scanned',
      'Handle ^ with right-to-left associativity correctly',
      'Final postfix output verification'
    ],
    sourcePYQYears: ['RTU 2020', 'RTU 2021', 'RTU 2023', 'SKIT MT-1 2024'],
    teacherEmphasisNote: 'Do NOT skip rows in the stack trace table. RTU examiners dock 2 marks if stack state is omitted.'
  },
  {
    id: 'pred_dsa_3',
    subjectId: 'dsa_3cs',
    unit: 4,
    part: 'PART_C',
    questionText: 'Explain Dijkstra\'s Algorithm for Single Source Shortest Path. Apply it to find the shortest path from vertex A to all other vertices in the given weighted graph and state its time complexity.',
    expectedMarks: 10,
    probability: 88,
    trendReason: 'Unit 4 cornerstone in RTU 2022 and 2023 End-Term exams. Always alternates with Prim/Kruskal MST.',
    modelAnswerPoints: [
      'Greedy algorithm strategy explanation',
      'Relaxation formula: if dist[u] + weight(u,v) < dist[v] then dist[v] = dist[u] + weight(u,v)',
      'Initialization table: Dist[] and Visited[] sets',
      'Step-by-step vertex extraction and distance update table',
      'Time complexity using Adjacency List + Min-Heap: O((V+E) log V)'
    ],
    sourcePYQYears: ['RTU 2022', 'RTU 2023'],
    teacherEmphasisNote: 'Always note that Dijkstra fails for negative edge weights, while Bellman-Ford can handle them.'
  },
  {
    id: 'pred_dsa_4',
    subjectId: 'dsa_3cs',
    unit: 1,
    part: 'PART_A',
    questionText: 'What is the limitation of a simple linear queue implemented using an array, and how does a circular queue overcome it?',
    expectedMarks: 2,
    probability: 94,
    trendReason: 'Classic RTU Part A definition repeated across 4 consecutive years and in 2024 Assignment 1 Q2.',
    modelAnswerPoints: [
      'Limitation: False overflow (elements deleted from front leave unused memory, but rear reaches MAX-1)',
      'Circular queue solution: Uses modulo arithmetic ((rear + 1) % MAX) to wrap around to index 0'
    ],
    sourcePYQYears: ['RTU 2021', 'RTU 2023', 'SKIT MT-1 2023'],
    teacherEmphasisNote: 'State the modulo formula explicitly in Part A answers.'
  },
  {
    id: 'pred_os_1',
    subjectId: 'os_4cs',
    unit: 3,
    part: 'PART_C',
    questionText: 'Explain Banker\'s Algorithm for Deadlock Avoidance. Given 5 processes P0-P4 and 3 resources A, B, C with Allocation, Max, and Available matrices, determine the Safe Sequence and evaluate a Resource Request.',
    expectedMarks: 10,
    probability: 98,
    trendReason: 'Guaranteed 10-mark question in RTU OS syllabus; matches current year Assignment 2 Q1 exactly.',
    modelAnswerPoints: [
      'Define Deadlock Avoidance vs Prevention',
      'Calculate Need Matrix = Max - Allocation',
      'Execute Safety Algorithm: Work and Finish vectors',
      'Derive safe execution sequence <P1, P3, P4, P0, P2>',
      'Test Resource Request condition: Request <= Need and Request <= Available'
    ],
    sourcePYQYears: ['RTU 2021', 'RTU 2022', 'RTU 2023', 'SKIT MT-2 2024'],
    teacherEmphasisNote: 'Dr. Meenakshi S. emphasizes writing the Work vector update explicitly after each process finishes.'
  },
  {
    id: 'pred_os_2',
    subjectId: 'os_4cs',
    unit: 4,
    part: 'PART_C',
    questionText: 'Compare FIFO, LRU, and Optimal page replacement algorithms on a given reference string with 3 page frames. Compute total page faults and hit ratios for each.',
    expectedMarks: 10,
    probability: 91,
    trendReason: 'Core numerical from Unit 4 appearing in every alternate RTU paper and current Assignment 2 Q2.',
    modelAnswerPoints: [
      'Draw the 3-frame grid for all 20 reference string items for FIFO, LRU, and Optimal',
      'Indicate Miss (Page Fault) and Hit clearly with symbols (* or H)',
      'Calculate: Total Faults, Total Hits, Hit Ratio = Hits / Total Requests',
      'Explain why Optimal is theoretically best but impossible to implement in practice (requires future knowledge)',
      'Mention Belady\'s Anomaly in relation to FIFO'
    ],
    sourcePYQYears: ['RTU 2020', 'RTU 2022', 'RTU 2023'],
    teacherEmphasisNote: 'Include the Belady\'s Anomaly remark for bonus marks in RTU marking scheme.'
  }
];
