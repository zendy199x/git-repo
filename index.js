import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";

const path = "./data.json";

const isValidDate = (date) => {
  const startDate = moment("2010-02-21");
  const endDate = moment("2024-12-13");
  return date.isBetween(startDate, endDate, null, "[]");
};

const markCommit = async (date) => {
  const data = { date: date.toISOString() };
  await jsonfile.writeFile(path, data);

  const git = simpleGit();
  await git.add([path]);
  await git.commit(date.toISOString(), { "--date": date.toISOString() });
};

const makeCommits = async (n) => {
  const git = simpleGit();

  for (let i = 0; i < n; i++) {
    const randomWeeks = random.int(0, 54 * 4);
    const randomDays = random.int(0, 6);

    const randomDate = moment("2019-01-01")
      .add(randomWeeks, "weeks")
      .add(randomDays, "days");

    if (isValidDate(randomDate)) {
      console.log(`Creating commit: ${randomDate.toISOString()}`);
      await markCommit(randomDate);
    } else {
      console.log(`Invalid date: ${randomDate.toISOString()}, skipping...`);
    }
  }

  console.log("Pushing all commits...");
  await git.push();
};

makeCommits(99000);
