import userSchema from "../model/userSchema.js";

export const registerController = async (req, res) => {
  try {
    const { name, email, password} = req.body;

    if (!name) {
      return res.send({ error: "Name is Required" });
    }
    if (!email) {
      return res.send({ message: "Email is Required" });
    }
    if (!password) {
      return res.send({ message: "Password is Required" });
    }
    
    //check user
    const exisitingUser = await userSchema.findOne({ email });
    //exisiting user
    if (exisitingUser) {
      return res.status(200).send({
        success: false,
        message: "Already Register please login",
      });
    }
   
   
    //save
    const user = await new userSchema({
      name,
      email,
      password,
    }).save();

    res.status(201).send({
      success: true,
      message: "User Register Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Errro in Registeration",
      error,
    });
  }
};

//POST LOGIN
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }
    //check user
    const user = await userSchema.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registerd",
      });
    }
   
    res.status(200).send({
      success: true,
      message: "login successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        amount: user.amount
       
      },
      
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};

export const paymentController = async (req, res) => {
    try {
      const { userid,reciverid,sendamout } = req.body;
  
      // Validate that payment is a positive number
      if (sendamout <= 0) {
        return res.status(400).send({
          success: false,
          message: "Payment amount must be greater than zero.",
        });
      }
  
      // Find sender and reciver
      const sender = await userSchema.findOne({ _id: userid });
      const reciver = await userSchema.findOne({ _id: reciverid });
  
      // Check if sender and reciver exist
      if (!sender || !reciver) {
        return res.status(404).send({
          success: false,
          message: "Sender or receiver not found.",
        });
      }
  
      // Ensure sender has enough balance for the payment
      if (sender.amount < sendamout) {
        return res.status(400).send({
          success: false,
          message: "Insufficient balance.",
        });
      }
  
      // Deduct from sender and add to reciver
      sender.amount -= sendamout;
      reciver.amount += sendamout;
  
      // Save the updated users
      await sender.save();
      await reciver.save();
  
      res.status(200).send({
        success: true,
        message: "Payment successful",
        user: {
          _id: reciver._id,
          name: reciver.name,
          email: reciver.email,
          role: reciver.role,
          amount: reciver.amount,
          MyBalance:sender.amount
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error processing payment",
        error,
      });
    }
  };
  

  export const userDetailController = async (req, res) => {
    try {
      const { id } = req.body;
      // Validation (consider adding validation logic here)
  
      const user = await userSchema.findOne({ _id: id });
  
      if (!user) {
        return res.status(404).send({
          success: false,
          message: "User not found",
        });
      }
  
      res.status(200).send({
        success: true,
        message: "User fetched successfully",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          amount: user.amount,
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error fetching user details",
        error,
      });
    }
  };

  export const allUserController = async (req, res) => {
    try {
     
      const user = await userSchema.find({ });
      res.status(200).send({
        success: true,
        message: "All user Fetched",
        user,
        
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error in fetching user",
        error,
      });
    }
  };



