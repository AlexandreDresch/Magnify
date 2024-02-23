export default function TransformationDetailsCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <>
      <p className="hidden text-dark-400/50 md:block">&#x25CF;</p>
      <div className="p-14-medium md:p-16-medium flex gap-2">
        <p className="text-dark-600">{title}:</p>
        <p className="capitalize text-purple-400">{description}</p>
      </div>
    </>
  );
}
