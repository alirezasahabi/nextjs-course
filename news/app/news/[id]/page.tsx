interface Props {
  params: Promise<{ id: string }>;
}
const NewsDetailsPage = async ({ params }: Props) => {
  const id = (await params).id;

  return <div>NewsDetailsPage ID: {id}</div>;
};

export default NewsDetailsPage;
