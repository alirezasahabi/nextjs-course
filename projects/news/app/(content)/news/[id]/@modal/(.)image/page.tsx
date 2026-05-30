/**
 * NOTE: This path description "(.)" in the intercepting route folder name
 *       won't need to change to "(..)", even though we did move it into a sub fodler.
 *       Because these parallel sub folders are ignored & this path we described here
 *       is actually not a path in our folder system, but instead
 *       in the URL path that will be rendered(because of our folder structure).
 *
 *       Parallel routes don't add anything to the URL. They're just there to
 *       organize the files in a certain way that NextJS expectes.
 *
 */

import ModalBackdrop from "@/components/modal-backdrop";
import { DUMMY_NEWS } from "@/dummy-news";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}
const InterceptedImagePage = async ({ params }: Props) => {
  const id = (await params).id;

  const news = DUMMY_NEWS.find((news) => news.id === id);

  if (!news) notFound();

  return (
    <>
      <ModalBackdrop />
      <dialog className="modal" open>
        <div className="fullscreen-image">
          <img src={`/images/news/${news?.image}`} alt={news?.title} />
        </div>
      </dialog>
    </>
  );
};

export default InterceptedImagePage;
