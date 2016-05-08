const branchDetails = {
    legend: 'Branch Name',
    rows: [{
        span: 1,
        fields: [{
            label: 'Branch Name',
            key: 'branch',
            type: 'text',
            span: 1,
            value: 'Globex Headquarters'
        }]
    }]
}

const personalDetails = {
    legend: 'Personal Details',
    rows: [{
        span: 5,
        fields: [{
            label: 'Title',
            key: 'title',
            type: 'select',
            options: ['Mr.', 'Mrs.'],
            span: 1,
            value: 'Mr.'
        }, {
            label: 'First Name',
            key: 'fname',
            type: 'text',
            span: 1,
            value: 'Lance'
        }, {
            label: 'Last Name',
            key: 'lname',
            type: 'text',
            span: 3,
            value: 'Uppercut'
        }, ]
    }, {
        span: 5,
        fields: [{
            label: 'Date of Birth',
            key: 'dob',
            type: 'date',
            span: 1,
            value: '1986-01-16'
        }, {
            label: 'Email Address',
            key: 'email',
            type: 'email',
            span: 4,
            value: 'luppercut@globex.com'
        }]
    }]
}


const maxWidth = 10

const productName = {
    label: 'Product Name',
    key: 'product',
    type: 'text',
    span: 7,
    value: ''
}

const tags = {
    label: 'Tags',
    key: 'tags',
    type: 'text',
    span: 3,
    value: ''
}

const vendor = {
    label: 'Vendor',
    key: 'vendor',
    span: 5,
    type: 'select',
    options: ['Vendor A', 'Vendor B']
}

const productType = {
    label: 'Product Type',
    key: 'productType',
    span: 5,
    type: 'select',
    options: ['Type 1', 'Type 2', 'Type 3']
}

const description = {
    label: 'Description',
    key: 'description',
    span: 10,
    type: 'text',
    value: ''
}

const sku = {
    label: 'sku',
    key: 'sku',
    type: 'text',
    span: 2,
    value: ''
}
const stockLevel = {
    label: 'Initial Stock Level',
    key: 'stockLevel',
    type: 'text',
    span: 2,
    value: ''
}
const costPrice = {
    label: 'Cost Price',
    key: 'costPrice',
    type: 'number',
    span: 2,
    value: null
}
const wholesalePrice = {
    label: 'Wholesale Price',
    key: 'wholesalePrice',
    type: 'number',
    span: 2,
    value: null
}

const retailPrice = {
    label: 'Retail Price',
    key: 'retailPrice',
    type: 'number',
    span: 2,
    value: null
}

const inventory = {
    legend: 'Add To Inventory',
    rows: [{
            span: maxWidth,
            fields: [productName, tags]
        }, {
            span: maxWidth,
            fields: [vendor, productType]
        }, {
            span: maxWidth,
            fields: [description]
        }, {
            span: maxWidth,
            fields: [sku, stockLevel, costPrice, wholesalePrice, retailPrice]
        }

    ]
}


const NewUserForm = {
    branchDetails: branchDetails,
    personalDetails: personalDetails
}
const InventoryForm = {
    inventory: inventory
}
Vue.config.devtools = true

new Vue({
    el: 'body',
    components: {
        gridForm: VueGridform
    },
    data: {
        newUserForm: {
            title: '<h2>New User Application</h2>',
            schema: NewUserForm
        },
        inventoryForm: {
            title: '<h2>Inventory Adjustment</h2>',
            schema: InventoryForm
        },
        activeForm: {},
        viewingSchema: false,
        formResults: null
    },
    methods: {
        viewSchema() {
            this.viewingSchema = !this.viewingSchema
        },
        switchForms(form) {
            this.formResults = {}
            this.activeForm = form
        },
        handleSubmit(a, b) {
            console.log(a, b)
            this.formResults = {
                obj: this.$refs.testForm.formData,
                arr: this.$refs.testForm.formValues
            }
        }
    }
})