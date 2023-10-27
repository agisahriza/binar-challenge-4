const { ResponseTemplate } = require('../helper/template.helper')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()


async function Insert(req, res) {
    const {
        name, email,
        password, identity_type,
        identity_number, address
    } = req.body

    try {
        const user = await prisma.users.create({
            data: {
                name,
                email,
                password,
            },
        });

        const profile = await prisma.profiles.create({
            data: {
                user_id: user.id,
                identity_type,
                identity_number,
                address,
            },
        });

        let resp = ResponseTemplate({ user, profile }, 'success', null, 200)
        res.json(resp)
        return

    } catch (error) {
        let resp = ResponseTemplate(null, 'internal server error', error, 500)
        res.json(resp)
        return
    }
}

async function Get(req, res) {
    const { page, perPage } = req.query;

    // Konversi halaman dan data per halaman ke tipe angka
    const pageNumber = parseInt(page) || 1;
    const itemsPerPage = parseInt(perPage) || 10;

    // Menghitung jumlah data yang akan dilewati (skip)
    const skip = (pageNumber - 1) * itemsPerPage;

    try {
        const totalData = await prisma.users.count();

        const users = await prisma.users.findMany({
            skip: skip,
            take: itemsPerPage,
        });

        const meta = {
            total: totalData,
            limit: itemsPerPage,
            page: pageNumber,
        };

        let resp = ResponseTemplate(users, 'success', null, 200, meta);
        res.json(resp);
    } catch (error) {
        let resp = ResponseTemplate(null, 'internal server error', error, 500);
        res.json(resp);
    }
}


async function Detail(req, res) {
    const { id } = req.params

    try {
        const user = await prisma.users.findUnique({
            where: {
                id: Number(id)
            },
            include: {
                profile: true,
            },
        })

        let resp = ResponseTemplate(user, 'success', null, 200)
        res.json(resp)
        return

    } catch (error) {
        let resp = ResponseTemplate(null, 'internal server error', error, 500)
        res.json(resp)
        return
    }
}


module.exports = {
    Insert,
    Get,
    Detail,
}