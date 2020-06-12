

## Live Demo

### Iteration 0

* Set to maximise the objective value and link back to before when we discussed what the objective value was
* Add a variable for each combination of day, meal, recipe. Set its objective value based on rating

Run it, see that every recipe is assigned to every slot.
Explain how that makes sense, given that we haven't restricted it at all and that's the best way to maximise the objective value.

### Iteration 0.5

* Add filter so recipes can only go in some meals

### Iteration 1

* Only one recipe assigned to each slot.
Need to add some constraints - link to rows in previous section.
Per slot, count the number of recipes that are enabled and make it exactly 1.

### Iteration 2

There's a lack of variety, eating the same thing multiple times per day. We want to stop that.

* For each day x recipe, count how many times it was eaten that day, and limit to at most 1.

### Iteration 3

Lots of very complex things every day.

* Limit time spent - for each day, sum total time of all recipes enabled, and limit to max based on input

No solution - not enough time allocated to prepare meals.

### Iteration 3.5

* Not all meals are required each day. Starter and dessert are always optional + breakfast on weekends is optional.

### Iteration 4

Lots of high-calorie things

* Limit daily calories - for each day, sum total calories of all recipes enabled,
and limit between min and max based on input

Try lowering number of calories.
Point out how low that number is.

### Iteration 5

Number of portions

* Add variable for number of portions, limit from min portions to max portions
* Explain why that doesn't make sense - We want to allow 0 portions
* Change min to 0
* We do want to enforce the min number of portions, we want 0 or min..max. Add one constraint saying that if eaten, portions > minPortions
* Only allow eaten if portions > 0
* Only allow portions if eaten === 1

### Future Iterations

Discuss what we could do next, and what future iterations could add

* Leftovers
* Not having the same thing twice two days in a row
* Adding cost, and letting the user decide how much to prioritise cost vs rating.
