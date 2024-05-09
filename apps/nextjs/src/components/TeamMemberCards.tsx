import { useState } from "react";
// import { PlusCircleIcon, XCircleIcon } from "@primer/octicons-react";
import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Linkedin, Twitter } from "react-feather";

interface Member {
  name: string;
  position: string;
  bio: string;
  email: string;
  linkedIn: string;
  facebook: string;
  instagram: string;
  twitter: string;
  portrait: string;
  key: string;
}

const MemberCard: React.FC<Member> = ({
  portrait,
  name,
  position,
  linkedIn,
  facebook,
  instagram,
  twitter,
}) => {
  const [openBio, setOpenBio] = useState(false);
  return (
    <div className="pb-12">
      <div
        onClick={() => setOpenBio(!openBio)}
        className="flex items-center justify-center"
      >
        <div className="h-80 w-64 rounded-lg bg-neutral-500 text-left text-white shadow-sm">
          <Image
            fill={false}
            width={300}
            height={300}
            className="aspect-[4/5] h-full w-full rounded-md object-cover"
            src={portrait}
            alt=""
          />
        </div>
      </div>
      <div className="flex flex-col items-center justify-center py-3">
        <h1 className="font-general-sans-medium text-lg text-gray-900">
          {name}
        </h1>
        <h1 className="w-48 text-center">{position}</h1>
        <h2 className="text-primary-200 flex flex-row space-x-4 pt-4">
          {linkedIn === "" ? (
            <></>
          ) : (
            <Link href={linkedIn} passHref className="hover:text-primary-400">
              <Linkedin size={20} />
            </Link>
          )}
          {instagram === "" ? (
            <></>
          ) : (
            <a href={instagram} className="hover:text-primary-400">
              <Instagram size={20} />
            </a>
          )}
          {facebook === "" ? (
            <></>
          ) : (
            <a href={facebook} className="hover:text-primary-400">
              <Facebook size={20} />
            </a>
          )}
          {twitter === "" ? (
            <></>
          ) : (
            <a href={twitter} className="hover:text-primary-400">
              <Twitter size={20} />
            </a>
          )}
        </h2>
      </div>
    </div>
  );
};

export function TeamMemberCards() {
  const developers = [
    {
      name: "Taylor Allen",
      postition: "Engineering Team Lead",
      email: "",
      linkedIn: "https://www.linkedin.com/in/taylorallen0913/",
      facebook: "",
      instagram: "",
      twitter: "",
      bio: "enter bio here",
      portrait: "/headshots/taylor.jpg",
    },
    {
      name: "Vaibhava Potturu",
      postition: "Back End Developer",
      email: "",
      linkedIn: "https://www.linkedin.com/in/vpotturu/",
      facebook: "",
      instagram: "",
      twitter: "",
      bio: "enter bio here",
      portrait: "/headshots/vaibhava.jpg",
    },
    {
      name: "Evan Emsley",
      postition: "Front End Developer",
      email: "",
      linkedIn: "https://www.linkedin.com/in/evan-emsley/",
      facebook: "",
      instagram: "",
      twitter: "",
      bio: "enter bio here",
      portrait: "/headshots/evan2.jpg",
    },
    {
      name: "Greta Haydock",
      postition: "Front End Developer",
      email: "",
      linkedIn: "https://www.linkedin.com/in/margaret-haydock",
      facebook: "",
      instagram: "https://www.instagram.com/greta.haydock/",
      twitter: "",
      bio: "enter bio here",
      portrait: "/headshots/greta.jpg",
    },
  ];
  const marketing = [
    {
      name: "Preethi Kumar",
      postition: "Marketing Strategy Lead",
      email: "",
      linkedIn: "https://www.linkedin.com/in/preethihkumar/",
      facebook: "",
      instagram: "",
      twitter: "",
      bio: "enter bio here",
      portrait: "/headshots/preethi.jpg",
    },
    {
      name: "Om Chaudhary",
      postition: "Marketing Strategist",
      email: "",
      linkedIn: "https://www.linkedin.com/in/om-chaudhary-/",
      facebook: "",
      instagram: "",
      twitter: "",
      bio: "enter bio here",
      portrait: "/headshots/om.jpg",
    },
  ];
  const projectManagers = [
    {
      name: "Bhavana Mathur",
      postition: "Co-Founder and Chief Executive Officer",
      email: "",
      linkedIn: "https://www.linkedin.com/in/bhavana-mathur/",
      facebook: "",
      instagram: "",
      twitter: "",
      bio: "enter bio here",
      portrait: "/headshots/bhavana.jpg",
    },
    {
      name: "Rukmini Sundhar",
      postition: "Co-Founder and Chief Technical Officer",
      email: "",
      linkedIn: "https://www.linkedin.com/in/rukmini-sundhar-17b45318/",
      facebook: "",
      instagram: "",
      twitter: "",
      bio: "enter bio here",
      portrait: "/headshots/rukmini2.jpg",
    },
  ];

  return (
    <div className="space-y-4 pt-0">
      <div className="text-center">
        <h1 className="font-itim-regular pb-12 text-2xl">Leadership</h1>
        <div className="grid grid-flow-row grid-cols-1 sm:grid-cols-2 gap-8 px-16">
          {projectManagers.map((member) => (
            <MemberCard
              key={member.name}
              name={member.name}
              position={member.postition}
              portrait={member.portrait}
              bio={member.bio}
              email={member.email}
              linkedIn={member.linkedIn}
              facebook={member.facebook}
              instagram={member.instagram}
              twitter={member.twitter}
            />
          ))}
        </div>
      </div>
      <div className="text-center">
        <h1 className="font-itim-regular pb-12 text-2xl">Engineering</h1>
        <div className="grid grid-flow-row grid-cols-1 md:grid-cols-2 gap-8 px-16 lg:grid-cols-4">
          {developers.map((member) => (
            <MemberCard
              key={member.name}
              name={member.name}
              position={member.postition}
              portrait={member.portrait}
              bio={member.bio}
              email={member.email}
              linkedIn={member.linkedIn}
              facebook={member.facebook}
              instagram={member.instagram}
              twitter={member.twitter}
            />
          ))}
        </div>
      </div>
      <div className="text-center">
        <h1 className="font-itim-regular pb-12 text-2xl">Marketing</h1>
        <div className="grid grid-flow-row grid-cols-1 sm:grid-cols-2 gap-8 px-16">
          {marketing.map((member) => (
            <MemberCard
              key={member.name}
              name={member.name}
              position={member.postition}
              portrait={member.portrait}
              bio={member.bio}
              email={member.email}
              linkedIn={member.linkedIn}
              facebook={member.facebook}
              instagram={member.instagram}
              twitter={member.twitter}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
