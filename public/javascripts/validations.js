// const validateRestaurant = (req, res, next) => {
// const {error} = restaurantSchema.validate(req.body);
// // console.log(result);
// // if (!req.body.restaurant) {
// //     next(new AppError('Invalid Restaurant Data', 404))
// // } else {
// if(error) {
//     const msg = error.details.map((el => el.message)).join(',')
//     throw new AppError(msg, 404)
// } else {
//     next();
// }
// }
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.validated-form')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()