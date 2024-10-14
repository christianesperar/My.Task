# Only1.Task

## Libraries
All the libraries suggested [here](https://gist.github.com/lithdew/1c162c714bf80c857682d95c14f01d50#requirements) plus added a few for the API integration, mock database, and authentication flow:
- axios
- argon2
- uiid
- cookie
- js-cookie

## Installation
Assuming that the computer already has `node` and `npm` installed, do the following:
```js
- git clone git@github.com:christianesperar/Only1.Task.git
- cd Only1.Task
- npm install --global yarn
- yarn install
- yarn run dev
```

## Testing
- All test accounts (eg: `test@test.com`) can be found on `app/db/users.json` and the real value of all the passwords that were encrypted by Argon2 are `test1234`
- Not all scopes are covered due to time restrictions. Features covered are the following:
  - User authentication
  - Viewing of given and received invites
  - Invite users
  - Delete users

## Demo
https://github.com/user-attachments/assets/1660e503-2f23-4ef5-968e-ce8291272bc5

