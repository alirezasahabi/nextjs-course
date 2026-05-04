import { Meal } from "@/lib/meals";
import MealItem from "./meal-item";
import classes from "./meals-grid.module.css";

interface Props {
  meals: Meal[];
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
