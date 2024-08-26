import Carousel from 'react-bootstrap/Carousel';
import "./Reviews.css";

const reviews = [
  {
    name: "John Doe",
    image: "https://via.placeholder.com/150",
    comment: "ExpenseEye has completely transformed how I manage my finances. It's intuitive and easy to use!",
  },
  {
    name: "Jane Smith",
    image: "https://via.placeholder.com/150",
    comment: "I love the simplicity of ExpenseEye. It helps me stay on top of my expenses without any hassle.",
  },
  {
    name: "Michael Johnson",
    image: "https://via.placeholder.com/150",
    comment: "The best expense tracker I've used so far. ExpenseEye makes budgeting so much easier. I love ExpenseEye",
  },
];

function Reviews() {
  return (
    <div className="review container-fluid">
      <h2 className="text-center mb-4 slide-top">What Our Users Say</h2>
      <Carousel indicators={true} controls={true} interval={5000} className='slide-left'>
        {reviews.map((review, index) => (
          <Carousel.Item key={index}>
            <div className="d-flex justify-content-center align-items-center flex-column text-center">
              <img
                src={review.image}
                alt={`${review.name}`}
                className="rounded-circle mb-3"
                style={{ width: '100px', height: '100px' }}
              />
              <h5>{review.name}</h5>
              <p className="px-4">{review.comment}</p>
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
}

export default Reviews;
