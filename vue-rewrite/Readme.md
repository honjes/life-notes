# Liefe Notes Rewrite

This is a rewrite of the Life Notes app in Vue.js.

## How to run

### Requirements

- Node.js
- [Ionic Cli](https://ionicframework.com/docs/intro/cli)

### Steps

1. Clone the repository
2. Navigate to the `vue-rewrite` folder
3. Run `npm install`
4. Run `ionic serve`

## How to develop

### Requirements

- [Node.js](https://nodejs.org/en/download/package-manager) Current
- [Ionic Cli](https://ionicframework.com/docs/intro/cli)

##### For Dev on Android

- [Android Studio](https://developer.android.com/studio)
- [Java](https://www.java.com/en/download/)

### Steps (Run in browser)

1. Clone the repository
2. Navigate to the `vue-rewrite` folder
3. Run `npm install`
4. Run `ionic serve`

### Steps (Run on Device)

#### Android

1. (if first build) Run `ionic cap add android`
2. Run `ionic cap open android`
3. run with android studio [Described here](https://capacitorjs.com/docs/android#running-with-android-studio)

## How to build

### Android

1. Run `npm run build`
2. (if first build) Run `ioniccap add android`
3. Run `ionic cap open android`
4. Build the app with android studio

## ToDo's

- [ ] make the data items more similar to each other (make label on all items ...)
- [ ] use the time format from the settings
- Complete French translation
  - [ ] "ACTION_TOAST"
  - [ ] "ADD_SYMPTOM_NAME"
  - [ ] "EMPTY_SYMPTOMS_1"
  - [ ] "FORM_REQUIRED"
  - [ ] "SAVE"
  - [ ] "DELETE"
  - [ ] "NAME"
  - [ ] "DATE"
  - [ ] "SUCCESSFULLY"
  - [ ] "FAILED"
  - [ ] "NO_ERROR_LOGS"
  - [ ] "NO_MEDS_FOUND"
