# Visualising Press Directories
![Screenshot of the functioning web app showing all components](/screenshot.png)
## What this is about
This repository contains the code for the final output of my Digital Residency with the Living with Machines project, a web app visualising the [Press Directories dataset](https://github.com/Living-with-machines/PressDirectories). The link to the app is: [https://living-with-machines.github.io/VisualisingPressDirectories/](https://living-with-machines.github.io/VisualisingPressDirectories/)

If you want to re-create this project, the file structure of this repository is the one to follow. The `input` and `pickles` folder are not here because they would just contain data present elsewhere, so they should be created. The former has to be populated with the data from the [Press Directories dataset](https://github.com/Living-with-machines/PressDirectories) and the [CLEA project](https://electiondataarchive.org/), while the latter is automatically populated by the cleaning processes listed in the [relevant Jupyter notebooks](https://github.com/nbonato/visualising_Press_Directories/tree/main/Jupyter%20notebooks).

I wrote a [final report for my project](https://github.com/nbonato/visualising_Press_Directories/blob/main/Turing_report.pdf) as well as a [blog post](https://livingwithmachines.ac.uk/lwm-digital-residency-visualising-the-press-directories-dataset/), hopefully they can further clarify what I did and found out during this project.

If you have any question, feel free to contact me either [here on GitHub](https://github.com/nbonato) or through [the contacts on my website](https://nbonato.com/contact).

## How to run it

If you want to run your own version of this, or create an alternative one, you should follow the following steps:

1. Clone this repository
2. Open the two "cleaning pipeline" Jupyter notebooks and download the source files indicated there
3. Use the notebooks to clean the two input files
4. Use the Json_creator notebook to export the two JSON files you need for the app to work
5. Open the `index.html` file or host it wherever and you should see the app working

## Learn more about the process
This repository contains only the last few commits to the project. 
If you want to sift through all the commit history for this project, you can do so on my original repository at [github.com/nbonato/turing](https://github.com/nbonato/turing).
