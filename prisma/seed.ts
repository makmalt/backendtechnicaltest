import { PrismaClient, MenuIconType } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // depth 1
  const systemmanagement = await prisma.menu.create({
    data: {
      name: 'systemmanagement',
      depth: 1,
      isVisible: false,
      iconType: MenuIconType.FOLDER,
      path: '/systemmanagement',
    },
  });

  // depth 2
  const systemManagement = await prisma.menu.create({
    data: {
      name: 'System Management',
      depth: 2,
      isVisible: false,
      iconType: MenuIconType.FOLDER,
      parentId: systemmanagement.id,
      path: '/systemmanagement/system-management',
    },
  });

  // depth 3
  const system = await prisma.menu.create({
    data: {
      name: 'System',
      depth: 3,
      isVisible: true,
      iconType: MenuIconType.FOLDER,
      parentId: systemManagement.id,
      path: '/systemmanagement/system-management/system',
    },
  });

  // depth 4
  const systemCode = await prisma.menu.create({
    data: {
      name: 'System Code',
      depth: 4,
      isVisible: true,
      iconType: MenuIconType.MENU,
      parentId: system.id,
      path: '/systemmanagement/system-management/system/system-code',
      route: '/system/system-code',
    },
  });

  console.log('✅ Seeding selesai:');
  console.table([
    {
      name: systemmanagement.name,
      depth: systemmanagement.depth,
      isVisible: systemmanagement.isVisible,
    },
    {
      name: systemManagement.name,
      depth: systemManagement.depth,
      isVisible: systemManagement.isVisible,
    },
    { name: system.name, depth: system.depth, isVisible: system.isVisible },
    {
      name: systemCode.name,
      depth: systemCode.depth,
      isVisible: systemCode.isVisible,
    },
  ]);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
