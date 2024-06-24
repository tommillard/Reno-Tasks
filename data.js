const jobs = [
    {
        title: "Job 1",
        id: 1,
        dependencies: [],
        category: "Kitchen",
    },
    {
        title: "Job 2",
        id: 2,
        dependencies: [1],
        category: "Kitchen",
    },
    {
        title: "Job 3",
        id: 3,
        dependencies: [1],
        category: "Bathroom",
    },
    {
        title: "Job 4",
        id: 4,
        dependencies: [2, 3],
        category: "Living Room",
    },
    {
        title: "Job 5",
        id: 5,
        dependencies: [4, 6],
        category: "Living Room",
    },
    {
        title: "Job 6",
        id: 6,
        dependencies: [1, 4],
        category: "Bedroom",
    },
    {
        title: "Job 7",
        id: 7,
        dependencies: [],
        category: "Bathroom",
    },
];
