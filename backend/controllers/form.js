import sgMail from '@sendgrid/mail'; // SENDGRID_API_KEY
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// contactForm
export const contactForm = (req, res) => {
    const {email, name, message} = req.body;
    // console.log(req.body) // test

    const emailData = {
        to: `${process.env.EMAIL_TO}`,
        from: `${process.env.EMAIL_FROM}`,
        subject: `Contact form - ${process.env.APP_NAME}`,
        text: `
            Receiver name: ${process.env.APP_NAME} \n
            Receiver email: ${process.env.EMAIL_TO} \n
            ----------------------------------------\n
            Email received from contact form: \n
            Sender name: ${name} \n
            Sender email: ${email} \n
            Sender message: ${message}
        `,
        html: `
            <p>Receiver name: ${process.env.APP_NAME}</p>
            <p>Receiver email: ${process.env.EMAIL_TO}</p>
            <hr/>
            <h4>Email received from contact form: </h4>
            <p>Sender name: ${name}</p>
            <p>Sender email: ${email}</p>
            <p>Sender message: ${message}</p>
            <hr/>
            <p>This email may contain sensetive information</p>
            <p>https://seoblog.com</p>
        `
    };

    sgMail.send(emailData)
        .then(sent => {
            return res.json({
                success: true
            });
        })
        .catch((err) => {
            console.log("Sendgrid ERROR: ", err);
            return res.status(400).json({
                success: false
            });
        });
};

// contactBlogAuthorForm
export const contactBlogAuthorForm = (req, res) => {
    const {authorEmail, email, name, message} = req.body;

    const maillist = [authorEmail, process.env.EMAIL_TO]

    const emailData = {
        to: maillist,
        from: `${process.env.EMAIL_FROM}`,
        subject: `Someone messaged you from ${process.env.APP_NAME}`,
        text: `
            ----------------------------------------\n
            Message received from: \n
            Name: ${name} \n
            Email: ${email} \n
            Message: ${message} \n
            ----------------------------------------\
        `,
        html: `
            <hr/>
            <h4>Message received from: </h4>
            <p>Name: ${name}</p>
            <p>Email: ${email}</p>
            <p>Message: ${message}</p>
            <hr/>
            <p>This email may contain sensetive information</p>
            <p>https://seoblog.com</p>
        `
    };

    sgMail.send(emailData)
        .then(sent => {
            return res.json({
                success: true
            });
        })
        .catch((err) => {
            console.log("Sendgrid ERROR: ", err);
            return res.status(400).json({
                success: false
            });
        });
};
