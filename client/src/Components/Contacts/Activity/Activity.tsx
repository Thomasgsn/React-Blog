import { IconArrowNarrowRight } from '@tabler/icons-react'

import "./Activity.css";

const Activity = () => {
  return (
    <div className="activitySection">
      <div className="heading flex">
        <h1>Recent Activity</h1>
        <button className="btn flex">
          See All
          <IconArrowNarrowRight className="icon" />
        </button>
      </div>

      <div className="secContainer grid">
        <div className="singleCustomer flex">
          <img
            src="https://placehold.co/600x400/grey/white?text=User"
            alt="Customer Image"
          />
          <div className="customerDetails">
            <span className="name">_oftyn</span>
            <small>Created a new prod</small>
          </div>
          <div className="duration">
            2 min ago
          </div>
        </div>
        <div className="singleCustomer flex">
          <img
            src="https://placehold.co/600x400/grey/white?text=User"
            alt="Customer Image"
          />
          <div className="customerDetails">
            <span className="name">_oftyn</span>
            <small>Created a new prod</small>
          </div>
          <div className="duration">
            14 min ago
          </div>
        </div>
        <div className="singleCustomer flex">
          <img
            src="https://placehold.co/600x400/grey/white?text=User"
            alt="Customer Image"
          />
          <div className="customerDetails">
            <span className="name">_oftyn</span>
            <small>Created a new prod</small>
          </div>
          <div className="duration">
            35 min ago
          </div>
        </div>
        <div className="singleCustomer flex">
          <img
            src="https://placehold.co/600x400/grey/white?text=User"
            alt="Customer Image"
          />
          <div className="customerDetails">
            <span className="name">_oftyn</span>
            <small>Created a new prod</small>
          </div>
          <div className="duration">
            52 min ago
          </div>
        </div>
      </div>
    </div>
  );
};

export default Activity;
