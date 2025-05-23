import Image from "next/image";

const SmallIconCard = ({
  photoName,
  stats,
  name,
}: {
  photoName: string;
  stats: string;
  name: string;
}) => {
  return (
    <div className="flex flex-col p-4 w-[200px] bg-gray-200 gap-4 justify-center items-center rounded-lg">
      <div className="flex justify-between gap-10">
        <Image src={photoName} alt="" width={40} height={40} />
        <h4 className="text-4xl font-bold">{stats}</h4>
      </div>
      <div className="">
        <h4 className="text-lg text-gray-800 font-medium">{name}</h4>
      </div>
    </div>
  );
};

export default SmallIconCard;
