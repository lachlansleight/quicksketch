# QuickSketch

### Overview

This is a little app I wrote to make it easy to setup varied quicksketch drawing sessions. You can add any image galleries you like and tag them for sorting and filtering - generate infinite custom quicksketch sessions!

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
2. Put your image folders into the `/public/` directory within the main folder. These are all required, I just split them up to make them easier to download! (So, a full path should look something like `/public/images/40/file-name-here.jpg`). You can get away with only using one, but you'll need to regenerate the metadata json - see the section below.
3. Create a file called `.env` and put the contents of `example-env.env` into it. Change the `FILE_PATH` value to match the public folder from above. Note the forward slashes!
4. In a terminal, navigate to the root directory (the directory containing package.json) and run `npm install` (this will take a while)
5. To run the app (in the same root directory) run `npm run dev`
6. You should now be able to access the app in your web browser at [http://localhost:3055](http://localhost:3055)
7. Verify that the image database is correctly setup by clicking on the 'Explore Image Sets & Tags' button in the top-left. There should be some 650k images.

### Regenerating metadata

If you want to modify the images in the database, you'll also need to regenerate the metadata.json file that the app uses to pre-cache tags and stuff. To do this, navigate to [http://localhost:3055/api/generateMetadata](http://localhost:3055/api/generateMetadata). This might take up to a minute or two if you have many images!

Alternatively, you can set `NEXT_PUBLIC_NO_CACHE` in the `.env` file to `true` to disable caching. Note that this will make the site **extremely slow** as the entire metadata database needs to be recalculated any time you want to get images. This is mainly just for development.

### Adding image sets

QuickSketch manages the image folder assuming everything will adhere to the following file structure: `/public/image-folder/[set-id]/[filename].jpg`. That is, you can organize your images into subfolders with any name you like. Within those subfolders, each image set must correspond to a folder of jpg images, and the folder name must contain only numbers.

To add tags to your image sets, the easiest option is to include a tags file within an image set folder the following name format: `TAGS_[your-tags-here].json`, the tags this file has will be applied to all images in the set. Note that tags are applied to an entire set, if you want to have separate tags for images within a set, split them into multiple sets.

The tag categories are hard-coded by me, so any tags you include that aren't known tags (i.e. tags that appear in the explore page) will be grouped in the 'other' category (e.g. other/yourtag). **Multi-word custom tags aren't supported**, so if you try to add `my-custom-tag`, your set will instead have `other/my`, `other/custom` and `other/tag` added to it.
