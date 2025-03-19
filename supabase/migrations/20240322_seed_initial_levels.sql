-- This migration seeds the initial 10 levels for the learning path
-- It creates a linear progression path with prerequisites

-- Insert 10 levels with increasing difficulty
INSERT INTO public.levels
  (id, title, description, order_index, thumbnail_url, xp_reward, coin_reward, required_level, content)
VALUES
  -- Level 1: Introduction
  (
    gen_random_uuid(),
    'Getting Started',
    'Introduction to programming basics and setup of your development environment.',
    1,
    '/images/levels/level1.jpg',
    100,
    50,
    1,
    '{
      "sections": [
        {
          "title": "Welcome",
          "content": "Welcome to your coding journey! This first level will introduce you to the basics."
        },
        {
          "title": "Setup",
          "content": "Let''s set up your development environment and get ready to code."
        }
      ]
    }'::jsonb
  ),
  
  -- Level 2: Basic Concepts
  (
    gen_random_uuid(),
    'Basic Programming Concepts',
    'Learn about variables, data types, and basic operations.',
    2,
    '/images/levels/level2.jpg',
    150,
    75,
    1,
    '{
      "sections": [
        {
          "title": "Variables",
          "content": "Variables are containers for storing data values."
        },
        {
          "title": "Data Types",
          "content": "Different kinds of data: numbers, strings, booleans, etc."
        }
      ]
    }'::jsonb
  ),
  
  -- Level 3: Control Flow
  (
    gen_random_uuid(),
    'Control Flow',
    'Master conditional statements and loops to control program execution.',
    3,
    '/images/levels/level3.jpg',
    200,
    100,
    1,
    '{
      "sections": [
        {
          "title": "If Statements",
          "content": "Conditional execution of code based on logical tests."
        },
        {
          "title": "Loops",
          "content": "Repeating actions with for and while loops."
        }
      ]
    }'::jsonb
  ),
  
  -- Level 4: Functions
  (
    gen_random_uuid(),
    'Functions and Methods',
    'Create reusable code blocks and understand scope and parameters.',
    4,
    '/images/levels/level4.jpg',
    250,
    125,
    2,
    '{
      "sections": [
        {
          "title": "Function Basics",
          "content": "How to define and call functions."
        },
        {
          "title": "Parameters",
          "content": "Passing data to functions and returning results."
        }
      ]
    }'::jsonb
  ),
  
  -- Level 5: Data Structures
  (
    gen_random_uuid(),
    'Data Structures',
    'Explore arrays, objects, and other ways to organize data.',
    5,
    '/images/levels/level5.jpg',
    300,
    150,
    2,
    '{
      "sections": [
        {
          "title": "Arrays",
          "content": "Working with ordered collections of data."
        },
        {
          "title": "Objects",
          "content": "Key-value pairs and complex data structures."
        }
      ]
    }'::jsonb
  ),
  
  -- Level 6: Object-Oriented Programming
  (
    gen_random_uuid(),
    'Object-Oriented Programming',
    'Learn about classes, inheritance, and object-oriented design patterns.',
    6,
    '/images/levels/level6.jpg',
    350,
    175,
    3,
    '{
      "sections": [
        {
          "title": "Classes",
          "content": "Creating blueprints for objects."
        },
        {
          "title": "Inheritance",
          "content": "Extending functionality through class hierarchies."
        }
      ]
    }'::jsonb
  ),
  
  -- Level 7: Error Handling
  (
    gen_random_uuid(),
    'Error Handling and Debugging',
    'Master techniques for handling errors and debugging code effectively.',
    7,
    '/images/levels/level7.jpg',
    400,
    200,
    3,
    '{
      "sections": [
        {
          "title": "Try-Catch",
          "content": "Gracefully handling errors in your code."
        },
        {
          "title": "Debugging",
          "content": "Tools and techniques for finding and fixing bugs."
        }
      ]
    }'::jsonb
  ),
  
  -- Level 8: Asynchronous Programming
  (
    gen_random_uuid(),
    'Asynchronous Programming',
    'Understand promises, async/await, and handle asynchronous operations.',
    8,
    '/images/levels/level8.jpg',
    450,
    225,
    4,
    '{
      "sections": [
        {
          "title": "Promises",
          "content": "Working with asynchronous code using promises."
        },
        {
          "title": "Async/Await",
          "content": "Modern syntax for handling asynchronous operations."
        }
      ]
    }'::jsonb
  ),
  
  -- Level 9: APIs and Data Fetching
  (
    gen_random_uuid(),
    'APIs and Data Fetching',
    'Learn to interact with external services and process data from APIs.',
    9,
    '/images/levels/level9.jpg',
    500,
    250,
    4,
    '{
      "sections": [
        {
          "title": "REST APIs",
          "content": "Understanding and working with RESTful services."
        },
        {
          "title": "Fetch API",
          "content": "Making HTTP requests and handling responses."
        }
      ]
    }'::jsonb
  ),
  
  -- Level 10: Project Development
  (
    gen_random_uuid(),
    'Final Project',
    'Apply everything you''ve learned in a comprehensive final project.',
    10,
    '/images/levels/level10.jpg',
    1000,
    500,
    5,
    '{
      "sections": [
        {
          "title": "Project Planning",
          "content": "Designing and planning your application."
        },
        {
          "title": "Implementation",
          "content": "Building your project from scratch."
        },
        {
          "title": "Deployment",
          "content": "Taking your application live."
        }
      ]
    }'::jsonb
  );

-- Store level IDs for setting up prerequisites
DO $$
DECLARE
  level_ids UUID[] := ARRAY(SELECT id FROM public.levels ORDER BY order_index);
BEGIN
  -- Create prerequisites (each level requires the previous one)
  FOR i IN 2..10 LOOP
    INSERT INTO public.level_prerequisites (level_id, prerequisite_id)
    VALUES (level_ids[i], level_ids[i-1]);
  END LOOP;
  
  -- Add some additional prerequisites to demonstrate complex dependencies
  -- Level 6 (OOP) also requires Level 4 (Functions)
  INSERT INTO public.level_prerequisites (level_id, prerequisite_id)
  VALUES (level_ids[6], level_ids[4]);
  
  -- Level 8 (Async) also requires Level 5 (Data Structures)
  INSERT INTO public.level_prerequisites (level_id, prerequisite_id)
  VALUES (level_ids[8], level_ids[5]);
  
  -- Level 10 (Final Project) requires multiple previous levels
  INSERT INTO public.level_prerequisites (level_id, prerequisite_id)
  VALUES 
    (level_ids[10], level_ids[6]),  -- OOP
    (level_ids[10], level_ids[8]);  -- Async
END $$; 