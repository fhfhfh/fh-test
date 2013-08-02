Peachy Developer Docs
=====================

The Peachy project is being developed on the [FeedHenry](http://www.feedhenry.com)
platform, and thus at a root level adheres to the conventions outlined by the
platform.

---

To begin with, the basic directory structure follows a simple guideline; the
FeedHenry platform will concern itself with code from two folders contained
within the root of the project:

### client
This is the directory containing all of the client-side code for the app. It
contains these essential folders/files:

+ **default** - The default client _package_.
    + **index.html** - The main HTML file of the client app.
    + ...

### cloud
This is the directory containing any cloud-side code which will be deployed on
the FeedHenry cloud. It contains these essential folders/files:

+ **main.js** - The JavaScript file which the FeedHenry platform loads initially
  to look for methods exposed as _act_ calls.
+ **package.json** - A configuration file outlining dependencies and other
  information, which the FeedHenry platform will use when deploying your
  application (see this [documentation](http://package.json.jit.su/)).
+ ...

---

Build Process for Demos
=======================
From the project root, run the following command:
```grunt ios```
Then go to builds/ios/ and open the Xcode project:
+ In top left, make sure iOS Device is the selected target
+ Click Project > Archive, the Organizer screen will open after Project is Archived.
+ Click Distribute... then Save for Enterprise or Ad-Hoc Deployment
+ Choose FEEDHENRY code signing
+ Choose where to save the Peachy.ipa locally

After this the IPA can be uploaded to the domain app-store: 'securehealthhub.feedhenry.com'