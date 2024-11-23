import skyImage from '../assets/quiz_images/sky.jpg';
import dogImage from '../assets/quiz_images/dog.jpg';
import bananaImage from '../assets/quiz_images/banana.jpg';
import appleImage from '../assets/quiz_images/apple.jpg';
import yellowImage from '../assets/quiz_images/yellow.jpg';
import traingle from '../assets/quiz_images/triangle.jpg';
import five from '../assets/quiz_images/five.jpg';
import cat from '../assets/quiz_images/cat.jpg';
import wheel from '../assets/quiz_images/wheel.jpg';
import carrot from '../assets/quiz_images/carrot.jpg';
import elephant from '../assets/quiz_images/elephant.jpg';
export const questions = {
    level1: [
      { question: "What color is the sky?", options: ["Blue", "White", "Grey", "Pink"], answer: "blue", image: skyImage },
      { question: "Which animal is this?", options: ["Cat", "Dog", "Rabbit", "Horse"], answer: "Dog", image: dogImage },
      { question: "What fruit is this?", options: ["Apple", "Banana", "Orange", "Grapes"], answer: "Banana", image: bananaImage},
      { question: "What is the color of a ripe apple?", options: ["Green", "Red", "Purple", "Violet"], answer: "Red", image: appleImage },
      
      { question: "Identify this color", options: ["Crimson", "Black", "Yellow", "Orange"], answer: "Yellow", image: yellowImage }
      // Add more questions as needed for level 1
    ],
    level2: [
      { question: "What is 2 + 2?", options: ["3", "4", "5", "6"], answer: "4" },
      { question: "Which letter comes after A?", options: ["B", "C", "D", "E"], answer: "B" },
      { question: "Which shape has three sides?", options: ["Circle", "Triangle", "Square", "Rectangle"], answer: "Triangle", image: traingle },
      { question: "What number is this?", options: ["2", "5", "7", "9"], answer: "5", image: five },
      { question: "What is 1 + 1?", options: ["2", "11", "1", "5"], answer: "2" }
      // Add more questions for level 2
    ],
    level3: [
      { question: "What animal makes a 'meow' sound?", options: ["Dog", "Cow", "Cat", "Sheep"], answer: "Cat", image: cat },
      { question: "What shape is a wheel?", options: ["Square", "Triangle", "Circle", "Rectangle"], answer: "Circle", image: wheel },
      { question: "What is (5 - 3)*0?", options: ["1", "2", "3", "0"], answer: "0" },
      { question: "Which one is a vegetable?", options: ["Apple", "Banana", "Carrot", "Orange"], answer: "Carrot", image: carrot },
      { question: "Identify this animal", options: ["Elephant", "Giraffe", "Zebra", "Lion"], answer: "Elephant", image: elephant }
      // Add more questions for level 3
    ],
  };
  
  