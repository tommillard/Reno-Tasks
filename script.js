let earliestEndDate = 0;

function calculateSchedule(jobs) {
    let unscheduledTaskCount = jobs.length;
    let currentDependencyLevel = 0;
    let maxLoopCount = 200;
    let currentLoopCount = 0;

    while (unscheduledTaskCount > 0) {
        if (currentLoopCount > maxLoopCount) {
            break;
        }
        currentLoopCount++;

        for (var job of jobs) {
            if (job.scheduled) {
                continue;
            }

            if (job.dependencies.length !== currentDependencyLevel) {
                continue;
            }

            if (job.dependencies.length === 0) {
                job.scheduled = true;
                job.startDay = 1;
                job.endDay = 2;
                unscheduledTaskCount--;
                continue;
            }

            let dependencies = jobs.filter((_job) =>
                job.dependencies.includes(_job.id)
            );

            let allDependenciesScheduled = dependencies.reduce(
                (accumulator, current) => {
                    if (!current.scheduled) {
                        accumulator = false;
                    }
                    return accumulator;
                },
                true
            );

            if (!allDependenciesScheduled) {
                continue;
            }

            job.startDay = dependencies.reduce((accumulator, current) => {
                accumulator = Math.max(accumulator, current.endDay);
                return accumulator;
            }, 0);

            job.endDay = job.startDay + 1;
            job.scheduled = true;
            unscheduledTaskCount--;
        }

        let unscheduledJobsAtDependencyLevel = jobs.filter((job) => {
            return (
                !job.scheduled &&
                job.dependencies.length === currentDependencyLevel
            );
        });

        if (unscheduledJobsAtDependencyLevel.length === 0) {
            currentDependencyLevel++;
        }
    }

    earliestEndDate = jobs.reduce((accumulator, current) => {
        accumulator = Math.max(current.endDay, accumulator);
        return accumulator;
    }, 0);

    document.body.style.setProperty("--maxDays", earliestEndDate);

    for (var job of jobs) {
        let dependants = jobs.filter((_job) => {
            return _job.dependencies.includes(job.id);
        });

        let latestFinishDate = dependants.reduce((accumulator, current) => {
            accumulator = Math.min(accumulator, current.startDay);
            return accumulator;
        }, earliestEndDate);

        if (dependants.length === 0) {
            job.endDay = earliestEndDate;
        } else {
            job.endDay = latestFinishDate;
        }
    }
    return jobs;
}

const scheduledJobs = calculateSchedule(jobs);

function renderSchedule(jobs) {
    const jobScheduleDiv = document.getElementById("jobSchedule");

    // Group jobs by category
    const categories = {};

    jobs.forEach((job) => {
        if (!categories[job.category]) {
            categories[job.category] = [];
        }
        categories[job.category].push(job);
    });

    // Render each category and its jobs
    for (const category in categories) {
        const categoryHeader = document.createElement("div");
        categoryHeader.className = "category-header";
        categoryHeader.textContent = category;
        jobScheduleDiv.appendChild(categoryHeader);

        categories[category].forEach((job) => {
            const jobContainer = document.createElement("div");
            jobContainer.className = "job-container";

            const jobTitle = document.createElement("div");
            jobTitle.className = "job-title";
            jobTitle.textContent = job.title;
            jobContainer.appendChild(jobTitle);

            for (let day = 1; day <= earliestEndDate - 1; day++) {
                // Assuming a maximum of 10 days for simplicity
                const dayDiv = document.createElement("div");
                dayDiv.className = "day";
                if (day >= job.startDay && day < job.endDay) {
                    dayDiv.classList.add("active-day");
                }
                jobContainer.appendChild(dayDiv);
            }

            jobScheduleDiv.appendChild(jobContainer);
        });
    }
}

renderSchedule(scheduledJobs);
