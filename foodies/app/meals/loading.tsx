/**
 * NextJS performs aggresive caching under hood.(It caches even more aggressively in production)
 * It caches any page we visit including the data of that page
 * & if we go to another page then come back it loads that existing page from the cache.
 * Only if we reload the page, it's recreated. 
 * But it would be nice to display a loading indicator whilst this page is loading.
 * Right now we have to wait & we don't see anything during that time.
 * If user vist the page for the first time when it's not cached, the user is waiting
 * & not sure if navigation request worked or not.
 * 
 * We can improve this experience by adding the "loading" file
 * which is another reserved file name in NextJS next to the page file.
 * This will become acitve if the page next to it or any nested page or layout
 * is loading data. In that case this the content of this component
 * is shown as a fallback until the data is there.
 */

import classes from "./loading.module.css";

const MealsLoading = () => {
  return <p className={classes.loading}>Loading meals...</p>;
};

export default MealsLoading;
