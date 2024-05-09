interface Advisor {
  name: string;
  position: string;
  portrait: string;
  key: string;
}

const AdvisorCard: React.FC<Advisor> = ({ name, position }) => {
    return (
      <div className="pb-12">
        <div
          className="flex items-center justify-center"
        >
          <div className="text-left h-80 w-64 rounded-md bg-gray-500 text-white">
            picture here
          </div>
        </div>
        <h1 className="font-general-sans-medium text-lg text-gray-900">{name}</h1>
        <h1>{position}</h1>
      </div>
    );
  };
  
  export function AdvisorCards() {
    
    const advisors = [
      {
        name: "Harsh",
        postition: "Position",
        portrait: "../images/qr-code.svg",
      },
      {
        name: "Other",
        postition: "position",
        portrait: "../images/qr-code.svg",
      },
    ];
    
  
    return (
      <div className="space-y-8 pt-8">
        <div className="text-center">
          <div className="columns-2 flex-wrap justify-between px-16">
            {advisors.map((member) => (
              <AdvisorCard
                key={member.name}
                name={member.name}
                position={member.postition}
                portrait={member.portrait}
              ></AdvisorCard>
            ))}
           </div>
        </div>
      </div>
    );
  }
  
