import { interviewCovers, mappings } from "@/constants";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {CreateWorkflowDTO} from "@vapi-ai/web/api";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const techIconBaseURL = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons";

const normalizeTechName = (tech: string) => {
  const key = tech.toLowerCase().replace(/\.js$/, "").replace(/\s+/g, "");
  return mappings[key as keyof typeof mappings];
};

const checkIconExists = async (url: string) => {
  try {
    const response = await fetch(url, { method: "HEAD" });
    return response.ok; // Returns true if the icon exists
  } catch {
    return false;
  }
};

export const getTechLogos = async (techArray: string[]) => {
  const logoURLs = techArray.map((tech) => {
    const normalized = normalizeTechName(tech);
    return {
      tech,
      url: `${techIconBaseURL}/${normalized}/${normalized}-original.svg`,
    };
  });

  const results = await Promise.all(
      logoURLs.map(async ({ tech, url }) => ({
        tech,
        url: (await checkIconExists(url)) ? url : "/tech.svg",
      }))
  );

  return results;
};

export const getRandomInterviewCover = () => {
  const randomIndex = Math.floor(Math.random() * interviewCovers.length);
  return `/covers${interviewCovers[randomIndex]}`;
};

export const createWorkflow = (userId: string): CreateWorkflowDTO => {
  return {
    "name": "AI Mock Interview",
    "nodes": [
      {
        "name": "start",
        "type": "conversation",
        "isStart": true,
        "metadata": {
          "position": {
            "x": 66.67280578613281,
            "y": 90.38066864013672
          }
        },
        "prompt": "Greet the user and help them create a new AI Interviewer.",
        "voice": {
          "model": "aura-2",
          "voiceId": "thalia",
          "provider": "deepgram"
        },
        "variableExtractionPlan": {
          "output": [
            {
              "title": "level",
              "description": "The job experience level",
              "type": "string",
              "enum": [
                "Entry",
                "Mid",
                "Senior"
              ]
            },
            {
              "title": "amount",
              "description": "Number of questions  to generate",
              "type": "number",
              "enum": []
            },
            {
              "title": "techstack",
              "description": "A list of technologies to cover during the job interview",
              "type": "string",
              "enum": []
            },
            {
              "title": "role",
              "description": "The role that users want to train for",
              "type": "string",
              "enum": []
            },
            {
              "title": "type",
              "description": "Type of interviews",
              "type": "string",
              "enum": [
                "Technical",
                "Behavioral",
                "Mixed"
              ]
            }
          ]
        },
        "messagePlan": {
          "firstMessage": "Hey there!"
        }
      },
      {
        "name": "conversation_1",
        "type": "conversation",
        "metadata": {
          "position": {
            "x": 66.67280578613281,
            "y": 384.14108657836914
          }
        },
        "prompt": "Say that the Interview will be generated shortly.",
        "voice": {
          "model": "aura-2",
          "voiceId": "thalia",
          "provider": "deepgram"
        },
        "variableExtractionPlan": {
          "output": []
        }
      },
      {
        "name": "hangup_1747512399374",
        "type": "hangup",
        "metadata": {
          "position": {
            "x": 159.67280578613276,
            "y": 1116.4822290732004
          }
        },
        "messagePlan": {
          "firstMessage": "Alright, have a nice day!"
        }
      },
      {
        "name": "apiRequest_1747890035347",
        "type": "apiRequest",
        "metadata": {
          "position": {
            "x": 66.67280578613281,
            "y": 603.8267552481611
          }
        },
        "method": "POST",
        "url": `${process.env.NEXT_PUBLIC_BASE_URL}/api/vapi/generate`,
        "headers": {
          "type": "object",
          "properties": {}
        },
        "body": {
          "type": "object",
          "properties": {
            "role": {
              "type": "string",
              "description": "",
              "value": "{{ role }}"
            },
            "level": {
              "type": "string",
              "description": "",
              "value": "{{ level }}"
            },
            "type": {
              "type": "string",
              "description": "",
              "value": "{{ type }}"
            },
            "techstack": {
              "type": "string",
              "description": "",
              "value": "{{ techstack }}"
            },
            "amount": {
              "type": "number",
              "description": "",
              "value": "{{ amount }}"
            },
            "userid": {
              "type": "string",
              "description": "",
              "value": userId
            }
          }
        },
        "output": {
          "type": "object",
          "properties": {}
        },
        "mode": "blocking",
        "hooks": []
      },
      {
        "name": "conversation_1747898363061",
        "type": "conversation",
        "metadata": {
          "position": {
            "x": 66.7402010677771,
            "y": 872.2493267791945
          }
        },
        "prompt": "Thank the user for the conversation and inform them that the interview has been generated successfully."
      }
    ],
    "edges": [
      {
        "from": "start",
        "to": "conversation_1",
        "condition": {
          "type": "ai",
          "prompt": "If user provided all the required variables."
        }
      },
      {
        "from": "conversation_1",
        "to": "apiRequest_1747890035347",
        "condition": {
          "type": "ai",
          "prompt": ""
        }
      },
      {
        "from": "apiRequest_1747890035347",
        "to": "conversation_1747898363061",
        "condition": {
          "type": "ai",
          "prompt": ""
        }
      },
      {
        "from": "conversation_1747898363061",
        "to": "hangup_1747512399374",
        "condition": {
          "type": "ai",
          "prompt": ""
        }
      }
    ]
  }
}
