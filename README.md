# QuickSketch

### Overview

This is a little app I wrote to make it easy to setup varied quicksketch drawing sessions. I scraped over half a million images from several drawing reference sites offered free thumbnail gallery previews, so there is a massive variety of poses, subjects, etc. The drawback is that the image quality is terrible, but hey it is what is.

Use the two dropdowns above to select how many images you'd like in your session and how long each image should appear for. Then, click Start!  
You can use the keyboard keys to jump back and forth within the randomly-generated image gallery.

If you like, you can click 'Configure tag filters' to have more fine-grained control on the type of images you'd like to see. I've set up some useful defaults.

Finally, you can browse the entire image database by clicking on the 'Explore Image Sets & Tags' button in the top-left.

Happy sketching!

### Requirements

1. Node.js (I'm on v18, but it should work with older versions)
2. NPM (I'm on 8.19.2)
3. I don't know if all of these are needed, but the list of globally installed npm modules I have installed is as follows (install them with `npm install [module-name] -g`):
    - ts-node@10.9.1
    - typescript@4.2.3
    - webpack-cli@3.3.12
    - webpack@4.44.1
    - eslint-cli@4.10.0

### Running

1. Extract the main application archive to a useful folder
2. Extract each of the image folders to the `/public/` directory within the main folder. These are all required, I just split them up to make them easier to download! (So, a full path should look something like `/public/images/40/file-name-here.jpg`). You can get away with only using one, but you'll need to regenerate the metadata json - see the section below.
3. Find the `.env` file in the root directory and change the FILE_PATH value to match the public folder from above. Note the forward slashes!
4. In a terminal, navigate to the root directory (the directory containing package.json) and run `npm install` (this will take a while)
5. To run the app (in the same root directory) run `npm run dev`
6. You should now be able to access the app in your web browser at [http://localhost:3055](http://localhost:3055)
7. Verify that the image database is correctly setup by clicking on the 'Explore Image Sets & Tags' button in the top-left. There should be some 650k images.

### Regenerating metadata

If you want to modify the images in the database, you'll also need to regenerate the metadata.json file that the app uses to pre-cache tags and stuff. To do this, navigate to [http://localhost:3055/api/generateMetadata](http://localhost:3055/api/generateMetadata). This might take up to a minute or two if you have many images!

Alternatively, you can set `NEXT_PUBLIC_NO_CACHE` in the `.env` file to `true` to disable caching. Note that this will make the site **extremely slow** as the entire metadata database needs to be recalculated any time you want to get images.

### Adding custom images

If you want to include your own image sets, this is totally possible! Just place all your images (.jpg only) in a folder with a unique numeric ID into any of the image folders within `/public/`. Make sure each file has the following name structure: `[id]_any-tags-you-like.jpg`, where ID is a unique id within the folder (it doesn't have to be globally unique). Also, lowercase only! Alternatively, you can include a tags file with the following name format: `TAGS_[your-tags-here].json`, the tags this file has will be applied to all images in the set.

The way tags are setup in the site that I scraped the original database images from is really weird and terrible (a lot of the development time for this project was spent interpreting the tags sensibly). The tag folders are hard-coded by me, so any tags you include that aren't known tags appearing in the explore page will be grouped in the 'other' category (e.g. other/yourtag). **Multi-word custom tags aren't supported**, so if you try to add `my-custom-tag`, your set will instead have `other/my`, `other/custom` and `other/tag` added to it.
