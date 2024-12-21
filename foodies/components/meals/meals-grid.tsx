import MealItem from "./meal-item";
import classes from "./meals-grid.module.css";

interface Props {
  meals: {
    id: number;
    image: string;
    title: string;
    creator: string;
    summary: string;
    slug: string;
  }[];
}
const MealsGrid = ({ meals }: Props) => {
  return (
    <ul className={classes.meals}>
      {meals.map((meal) => (
        <li key={meal.id}>
          <MealItem {...meal} />
        </li>
      ))}
    </ul>
  );
};

export default MealsGrid;
