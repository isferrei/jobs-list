import React from "react";
import axios from "axios";
import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Heading,
  Text,
} from "@chakra-ui/react";
import ReactHtmlParser from "react-html-parser";
//This page uses Chakra UI components for styling and layout, and ReactHtmlParser to safely render the job description as HTML.

import styles from "./styles.module.scss";
//The component uses sass for styling only this page

type Jobs = {
  uuid: string;
  title: string;
  companyName: string;
  description: string;
  publishedDate: Date;
};

interface JobsProps {
  jobs: Jobs[];
}

export default function Test({ jobs }: JobsProps) {
  //The component receives the job data as a prop, and has two buttons for filtering the job cards by date and company name.
  const [filteredJobs, setFilteredJobs] = React.useState<Jobs[]>(jobs);
  //The component uses the useState hook to keep track of the filtered jobs, which is initialized to the job data prop.

  function filterByDate() {
    let last7days = new Date();
    last7days.setDate(last7days.getDate() - 7);

    setFilteredJobs(
      jobs
        .filter((job) => new Date(job.publishedDate) >= last7days)
        .sort((jobA, jobB) => {
          return (
            new Date(jobB.publishedDate).getTime() -
            new Date(jobA.publishedDate).getTime()
          );
        })
    );
  }
  //The filterByDate function filters the jobs to only show those that were published in the last 7 days, and sorts them by date in descending order.

  function filterByCompany(companyName: string) {
    setFilteredJobs(jobs.filter((job) => job.companyName === companyName));
  }
  //The filterByCompany function filters the jobs to only show those that match the specified company name.

  return (
    <main className={styles.container}>
      <div className={styles.filters}>
        <Button onClick={() => filterByDate()} colorScheme="blue">
          Last 7 days
        </Button>
        <Menu>
          <MenuButton
            as={Button}
            rightIcon={<ChevronDownIcon />}
            colorScheme="blue"
          >
            Company name
          </MenuButton>
          <MenuList>
            {/* Mapping the menu items */}
            {jobs.map((job) => (
              <MenuItem
                onClick={() => filterByCompany(job.companyName)}
                key={`company-${job.companyName}`}
              >
                {job.companyName}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      </div>

      {filteredJobs.map((job) => (
        <div className={styles.card} key={job.uuid}>
          <Heading>{job.title}</Heading>
          <Text fontSize="lg">{job.companyName}</Text>
          <Text fontSize="sm">
            {/*The .toLocaleDateString format the date that will appear for the user*/}
            {new Date(job.publishedDate).toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </Text>
          <div>
            <Text fontSize="2xl" as="b">
              Job Description:
            </Text>
            {/*Rendering the job description using react-html-parser to parse the HTML content of the job description. */}
            {ReactHtmlParser(job.description)}
          </div>
        </div>
      ))}
    </main>
  );
}

//The component also exports a getStaticProps function that is used by Next.js to fetch job data from the external API before rendering the component on the server-side.
export async function getStaticProps() {
  const response = await axios.post("https://www.zippia.com/api/jobs/", {
    companySkills: true,
    dismissedListingHashes: [],
    fetchJobDesc: true,
    jobTitle: "Business Analyst",
    locations: [],
    numJobs: 10,
    previousListingHashes: [],
  });
  //The getStaticProps function uses the axios library to make a POST request to the API, passing in some parameters to specify what data to fetch.

  const jobs = response.data.jobs.map(
    (job: {
      jobId: any;
      jobTitle: any;
      companyName: any;
      jobDescription: any;
      postingDate: string | number | Date;
    }) => {
      return {
        uuid: job.jobId,
        title: job.jobTitle,
        companyName: job.companyName,
        description: job.jobDescription,
        publishedDate: new Date(job.postingDate).toJSON(),
      };
    }
  );
  //The response data is then processed to extract the job data and format it into a suitable format for the component.

  return {
    props: { jobs },
  };
}
